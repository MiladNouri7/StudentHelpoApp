export function delayTime(ms){
    return new Promise(resolve => setTimeout(resolve, ms));
}

export const getTheImageFileExtension = (imageFileName) => {
    return imageFileName.slice((imageFileName.lastIndexOf('.') -1 >>> 0) + 2)
}

export function createDataTree(commentsData){
    let commentsHashtable = Object.create(null);
    commentsData.forEach(function(item){
        commentsHashtable[item.id] = {...item, childNodes: []}
    });

    let commentsDataTree = [];
    commentsData.forEach(function(item){
        if(item.parentId) commentsHashtable[item.parentId].childNodes.push(commentsHashtable[item.id]);
        else commentsDataTree.push(commentsHashtable[item.id]);
    })


    return commentsDataTree;
}