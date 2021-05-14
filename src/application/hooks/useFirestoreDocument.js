import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { asynchronousActionError, finishAsynchronousAction, startAsynchronousAction } from "../asynchronousReducer";
import { dataSnapshotFromFs } from "../firebase/firestoreService";

const useFirestoreDocument = (prop) => {
    const {query, data, deps, shouldExecute = true} = prop;
    const dispatch = useDispatch();

    useEffect(() => {
        if(!shouldExecute) return;
        dispatch(startAsynchronousAction());
        const unsubscribe = query().onSnapshot(
            snapshot => {
                if(!snapshot.exists){
                    dispatch(asynchronousActionError({code: "not-found", message: "Could not find document"}));
                    return;
                }
                data(dataSnapshotFromFs(snapshot));
                dispatch(finishAsynchronousAction());
            },

            error => dispatch(finishAsynchronousAction())
        );

        return () => {
            unsubscribe()
        }
    }, deps) //eslint-disable-line react-hooks/exhaustive-deps
}

export default useFirestoreDocument;