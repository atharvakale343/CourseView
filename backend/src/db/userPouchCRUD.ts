export function saveDocumentByEmail(
    email: string,
    key: string,
    value: Record<string, unknown> | any[],
    db: PouchDB.Database,
): Promise<PouchDB.Core.Response> {
    const obj = {
        _id: email,
        [key]: value,
    };
    return db
        .get(email)
        .then(doc => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            doc[key] = value; // update the key
            return db.put(doc);
        })
        .catch(err => {
            if (err.name === "not_found") {
                return db.put(obj); // create a new document
            } else {
                return Promise.reject(err);
            }
        });
}

export function getStoredKeyByEmail<T>(
    email: string,
    key: string,
    db: PouchDB.Database,
): Promise<T> {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return db.get(email).then(doc => doc[key]);
}

export function getDocumentByEmail<Value>(
    email: string,
    key: string,
    db: PouchDB.Database,
): Promise<
    {
        [key: string]: Value;
    } & PouchDB.Core.IdMeta &
        PouchDB.Core.GetMeta
> {
    return db.get<{ [key: string]: Value }>(email);
}
