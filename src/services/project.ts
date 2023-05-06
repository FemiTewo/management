import {db} from './firebaseConfig';

export const getProjects = async (id: string) => {
  const docRef = db.collection('users').doc(id);
  if (docRef) {
    try {
      const doc = await docRef.get();
      if (doc.exists) {
        const referenceArray = doc.data().projects;
        const referencedDocs = await Promise.all(
          referenceArray.map(async ref => {
            const rs = await ref.get();
            let rsData = rs.data();
            rsData['id'] = rs.id;
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
        const referenceArray = doc.data().boards;
        const referencedDocs = await Promise.all(
          referenceArray.map(async ref => {
            const rs = await ref.get();
            let rsData = rs.data();
            console.log(rsData);
            rsData['id'] = rs.id;
            delete rsData.tasks;
            return rs.data();
          }),
        );
        console.log(referencedDocs);
        return referencedDocs;
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
          referenceArray.map(async ref => {
            const rs = await ref.get();
            let rsData = rs.data();
            rsData.id = rs.id;
            const user = await rsData.user.get();
            let userData = user.data();
            userData.id = rs.id;
            delete userData.projects;
            const tagsArrayReference = rsData.tags;
            const tagsReferencedDocs = await Promise.all(
              tagsArrayReference.map(async ref => {
                const tag = await ref.get();
                let tagData = tag.data();
                tagData.id = rs.id;
                delete rsData.projects;
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
        console.log('referenceDoc ==========>', referencedDocs);
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
        const referenceArray = doc.data().tasks;
        const referencedDocs = await Promise.all(
          referenceArray.map(async ref => {
            const rs = await ref.get();
            let rsData = rs.data();
            rsData['id'] = rs.id;
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
        const referenceArray = doc.data().messages;
        const referencedDocs = await Promise.all(
          referenceArray.map(async ref => {
            const rs = await ref.get();
            let rsData = rs.data();
            rsData['id'] = rs.id;
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
