import {db, fieldValue} from './firebaseConfig';

export const getAllUsers = async () => {
  const snapshot = await db.collection('users').get();
  return snapshot.docs.map(doc => {
    const docData = {...doc.data(), id: doc.id};
    delete docData.projects;
    return docData;
  });
};
export const getProjects = async (id: string) => {
  const docRef = db.collection('users').doc(id);
  if (docRef) {
    try {
      const doc = await docRef.get();
      if (doc.exists) {
        const referenceArray = (doc.data() as any).projects;
        // if (referenceArray.length > 0) {
        //   return;
        // }
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
      console.log('Error retrieving document in projects:', error);
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
      console.log('Error retrieving document in getBoards:', error);
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

            delete rsData.tasks;
            delete rsData.messages;
            return {...rsData};
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

export const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

export const getDeepColors = () => {
  return [
    '#169C97',
    '#6B3747',
    '#017674',
    '#92395F',
    '#DEC7D1',
    '#AF3A95',
    '#2B24C7',
    '#BBCAB2',
    '#2B7B32',
    '#3B7DEC',
    '#F4A4DC',
    '#70DBB6',
    '#FF75A7',
    '#39BCF2',
    '#ACC12E',
    '#A1D1CC',
    '#C5EF91',
    '#589C26',
    '#D622CE',
    '#2A3F72',
  ];
};

export function max_date(tasks) {
  let all_dates = [];
  tasks.map(task => {
    all_dates.push(task.end);
  });
  var max_dt = all_dates[0],
    max_dtObj = new Date(all_dates[0]);
  all_dates.forEach(function (dt, index) {
    if (new Date(dt) > max_dtObj) {
      max_dt = dt;
      max_dtObj = new Date(dt);
    }
  });
  return max_dt;
}
export function min_date(tasks) {
  let all_dates = [];
  tasks.map(task => {
    all_dates.push(task.start);
  });
  let min_dt = all_dates[0],
    min_dtObj = new Date(all_dates[0]);
  all_dates.forEach(function (dt, index) {
    if (new Date(dt) < min_dtObj) {
      min_dt = dt;
      min_dtObj = new Date(dt);
    }
  });
  return min_dt;
}

export function getDatesBetween(startDate: string, endDate: string) {
  let sDate = new Date(startDate);
  let eDate = new Date(endDate);

  const dates = [];
  let currentDate = new Date(sDate);

  while (currentDate <= eDate) {
    dates.push(new Date(currentDate).toISOString().substring(0, 10));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
}

export const changeBoardStatus = async (
  board: string,
  status: 'Ongoing' | 'Compleeted' | 'Deleted',
) => {
  try {
    await db.collection('board').doc(board).update({status});
    return true;
  } catch (e) {
    console.log(e);
    return false;
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

export const changeProjectStatus = async (
  task: string,
  status: 'Ongoing' | 'Completed',
) => {
  try {
    await db.collection('projects').doc(task).update({status});
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
};

export const changeProjectDetails = async (project: string, data: any) => {
  try {
    delete data.id;
    await db.collection('projects').doc(project).update({data});
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
};

export const changeBoardDetails = async (board: string, data: any) => {
  try {
    delete data.id;
    await db
      .collection('boards')
      .doc(board)
      .update({...data});
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
    console.log(e);
    return false;
  }
};
export const saveTask = async (task: any, board: string) => {
  let concat: any[] = [];
  if (task.assigned_to.length > 0) {
    task.assigned_to.map((t: string) => {
      concat.push(db.doc(`users/${t}`));
    });
  }
  try {
    const data = {
      ...task,
      messages: [],
      assigned_to: concat,
    };
    let newTaskDoc = await db.collection('tasks').add(data);
    console.log(newTaskDoc);
    await db
      .collection('boards')
      .doc(board)
      .update({
        tasks: fieldValue.arrayUnion(db.doc(`tasks/${newTaskDoc?.id}`)),
      });
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
};
export const saveBoard = async (boardInput: any, project: string) => {
  try {
    delete boardInput.project;
    const data = {
      ...boardInput,
      tasks: [],
    };
    let newBoardDoc = await db.collection('boards').add(data);

    await db
      .collection('projects')
      .doc(project)
      .update({
        boards: fieldValue.arrayUnion(db.doc(`boards/${newBoardDoc?.id}`)),
      });
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
};

export const saveProject = async (project: any, user: string) => {
  try {
    const data = {
      ...project,
      boards: [],
      members: [],
    };
    let newBoardDoc = await db.collection('projects').add(data);

    await db
      .collection('users')
      .doc(user)
      .update({
        projects: fieldValue.arrayUnion(db.doc(`projects/${newBoardDoc?.id}`)),
      });
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
};

export const saveTeamMembers = async (project: string, team: any[]) => {
  try {
    const data = {
      members: [...team.map(member => db.doc(`users/${member.id}`))],
    };
    await db.collection('projects').doc(project).update({
      members: data.members,
    });
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
};
