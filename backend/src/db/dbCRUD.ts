import { userDB } from "./pouchdbSetup";
import { type Account } from "./../../../frontend/src/lib/types/account";
import { SuccessMessage } from "../utils/MessageTypes";
import { getStoredKeyByEmail, saveDocumentByEmail } from "./userPouchCRUD";

export async function saveAccount(acc: Account): Promise<SuccessMessage> {
    const obj = {
        _id: acc.email,
        account: acc,
    };
    return saveDocumentByEmail(acc.email, "account", acc, userDB).then(
        res => ({ message: "success", detail: res } as SuccessMessage),
    );
}

export async function getAccount(email: string): Promise<Account> {
    return getStoredKeyByEmail<Account>(email, "account", userDB);
}

// export function addCourse(email: string, course: Record<string, unknown>): any {
//     let ret;
//     const suuid = uuidv4();
//     const id = email.concat("_", suuid);
//     const obj = {
//         _id: id,
//         course: course,
//     };
//     courseDB
//         .put(obj)
//         .then(res => (ret = { status: 201, resp: res }))
//         .catch(function (err) {
//             console.log(err);
//             ret = { status: 500, error: err };
//         });
//     return ret;
// }

// export function getCourses(email: string): Record<string, unknown>[] {
//     let ret: Record<string, unknown>[] = [{}];
//     const idpre = email.concat("_");
//     courseDB.createIndex({
//         index: { fields: ["_id"] },
//     });
//     async function finder(): Promise<Record<string, unknown>[]> {
//         const found = await courseDB.find({
//             selector: { name: { $regex: `/${idpre}.*` } },
//         });
//         // eslint-disable-next-line @typescript-eslint/ban-ts-comment
//         // @ts-ignore
//         const courses = found.docs.map(row => row.course);
//         return courses;
//     }
//     finder()
//         .then(result => (ret = result))
//         .catch(result => (ret = [{ status: 500, err: result }]));
//     console.log(ret);
//     return ret;
// }
