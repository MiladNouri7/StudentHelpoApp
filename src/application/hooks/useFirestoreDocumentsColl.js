import { useEffect } from "react";
import { asynchronousActionError, finishAsynchronousAction, startAsynchronousAction } from "../asynchronousReducer";
import { dataSnapshotFromFs } from "../firebase/firestoreService";
import { useDispatch } from "react-redux";

const useFirestoreDocumentsColl = (prop) => {
    const {query, data, deps} = prop;
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(startAsynchronousAction());
        const unsubscribe = query().onSnapshot(
            snapshot => {
                const docs = snapshot.docs.map(doc => dataSnapshotFromFs(doc));
                data(docs);
                dispatch(finishAsynchronousAction());
            },

            error => dispatch(asynchronousActionError(error))
        );

        return () => {
            unsubscribe()
        }
    }, deps) //eslint-disable-line react-hooks/exhaustive-deps
}

export default useFirestoreDocumentsColl;

