import {db, fieldValue} from './firebaseConfig';

export const getProjects = async (id: string) => {
  const docRef = db.collection('users').doc(id);
  if (docRef) {
    try {
      const doc = await docRef.get();
      if (doc.exists) {
        const referenceArray = (doc.data() as any).projects;
        const referencedDocs = await Promise.all(
          referenceArray.map(async (ref: any) => {
            const rs = await ref.get();
            let rsData = rs.data();
            rsData.id = rs.id;
            delete rsData.boards;
            delete rsData.members;
            return rs.data();
          }),
        );
        return referencedDocs;
      } else {
        console.log('Document does not exist');
      }
    } catch (error) {
      console.log('Error retrieving document:', error);
    }
  }
};

export const getBoards = async (id: string) => {
  const docRef = db.collection('projects').doc(id);
  if (docRef) {
    try {
      const doc = await docRef.get();
      if (doc.exists) {
        const referenceArray = (doc.data() as any).boards;
        const membersReferenceArray = (doc.data() as any).members;
        const referencedDocs = await Promise.all(
          [...referenceArray, ...membersReferenceArray].map(
            async (ref: any) => {
              const rs = await ref.get();
              let rsData = rs.data();
              rsData.id = rs.id;
              delete rsData.tasks;
              return rsData;
            },
          ),
        );
        let finalData = {members: [], boards: []};
        referencedDocs.map(item => {
          if ((item as Object).hasOwnProperty('email')) {
            return finalData.members.push(item);
          }
          return finalData.boards.push(item);
        });
        console.log('Promise =====>', finalData);
        return finalData;
      } else {
        console.log('Document does not exist');
      }
    } catch (error) {
      console.log('Error retrieving document:', error);
    }
  }
};

export const getItemsFromTask = async (id: string) => {
  const docRef = db.collection('tasks').doc(id);
  if (docRef) {
    try {
      const doc = await docRef.get();
      if (doc.exists) {
        const referenceArray = (doc.data() as any).messages;
        const referencedDocs = await Promise.all(
          referenceArray.map(async (ref: any) => {
            const rs = await ref.get();
            let rsData = rs.data();
            rsData.id = rs.id;

            const userRef = rsData.user;
            const user = await userRef.get();
            let userData = user.data();
            userData.id = user.id;
            delete userData.projects;

            console.log('got here');
            const tagsArrayReference = rsData.tags;
            const tagsReferencedDocs = await Promise.all(
              tagsArrayReference.map(async (rf: any) => {
                const tag = await rf.get();
                let tagData = tag.data();
                tagData.id = tag.id;
                delete tagData.projects;
                return tagData;
              }),
            );
            rsData.tagReference = tagsReferencedDocs;
            rsData.userReference = userData;
            delete rsData.tags;
            delete rsData.user;
            return rs.data();
          }),
        );
        return referencedDocs;
      } else {
        console.log('Document does not exist');
      }
    } catch (error) {
      console.log('Error retrieving document:', error);
    }
  }
};

export const getTasksFromBoard = async (id: string) => {
  const docRef = db.collection('boards').doc(id);
  if (docRef) {
    try {
      const doc = await docRef.get();
      if (doc.exists) {
        const referenceArray = (doc.data() as any).tasks;
        const referencedDocs = await Promise.all(
          referenceArray.map(async (ref: any) => {
            const rs = await ref.get();
            let rsData = rs.data();
            rsData.id = rs.id;
            const us = await rsData.assigned_to.get();
            const usData = us.data();
            delete usData.projects;
            delete rsData.tasks;
            delete rsData.messages;
            return {...rsData, assigned_to: usData};
          }),
        );
        return referencedDocs;
      } else {
        console.log('Document does not exist');
      }
    } catch (error) {
      console.log('Error retrieving document:', error);
    }
  }
};

export const getUserFromTask = async (id: string) => {
  const docRef = db.collection('tasks').doc(id);
  if (docRef) {
    try {
      const doc = await docRef.get();
      if (doc.exists) {
        const referenceArray = (doc.data() as any).messages;
        const referencedDocs = await Promise.all(
          referenceArray.map(async (ref: any) => {
            const rs = await ref.get();
            let rsData = rs.data();
            rsData.id = rs.id;
            const us = await rsData.user.get();
            const user = us.data();
            delete rsData.tags;
            delete user.project;
            delete rsData.user;
            return {message: rsData, user};
          }),
        );
        return referencedDocs;
      } else {
        console.log('Document does not exist');
      }
    } catch (error) {
      console.log('Error retrieving document:', error);
    }
  }
};

export const changeTaskStatus = async (
  task: string,
  status: 'To-do' | 'In Progress' | 'Quality Assurance' | 'Done' | 'Deleted',
) => {
  try {
    await db.collection('tasks').doc(task).update({status});
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
};

export const saveMessage = async (
  message: string,
  tags: string[],
  user: string,
  task: string,
) => {
  try {
    const data = {
      message,
      tags: [...tags.map(tag => db.doc(`users/${tag}`))],
      user: db.doc(`users/${user}`),
    };
    let newMessageDoc = await db.collection('messages').add(data);
    console.log(newMessageDoc);
    await db
      .collection('tasks')
      .doc(task)
      .update({
        messages: fieldValue.arrayUnion(
          db.doc(`messages/${newMessageDoc?.id}`),
        ),
      });
    return true;
  } catch (e) {
    return false;
    console.log(e);
  }
};
