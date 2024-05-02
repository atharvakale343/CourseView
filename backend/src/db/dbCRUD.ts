import { response } from "express";
import { userDB, courseDB } from "../config/db";
import { v4 as uuidv4 } from "uuid";
//import { type Account } from "./../../../frontend/src/lib/types/account"; 

type Account = {
    id: string;
    email: string; 
    majors: string[];
    expectedSem: string;
};

export function addAccount(acc: Account): any {
    let ret;
    const obj = {
        _id: acc.email,
        account: acc,
    };
    userDB.put(obj)
        .then(res => ret = { status: 201, res: res })
        .catch(function (err) {
            console.log(err);
            ret = { status:500, error: err };
        });
    return ret;
}

export function getAccount(email: string): any {
    let ret;
    userDB.get(email).then(docu => 
        // @ts-ignore
        ret = { status: 201, acc: docu.account })
    .catch(function (err) {
        console.log(err);
        ret = { status: 400, error: err };
    });
    return ret;
}

export function addCourse(email: string,course: Record<string,unknown>): any {
    let ret;
    const suuid = uuidv4();
    const id = email.concat("_", suuid);
    const obj = {
        _id: id,
        course: course,
    };
    courseDB.put(obj)
    .then(res => ret = { status: 201, resp:res })
    .catch(function (err){
        console.log(err);
        ret = { status:500, error: err };
    });
    return ret;
}

export function getCourses(email: string): Record<string,unknown>[] {
    let ret: Record<string,unknown>[] = [{}];
    const idpre = email.concat("_");
    courseDB.createIndex({
        index: { fields: ['_id'] },
      });
    async function finder(): Promise<Record<string,unknown>[]> {
        const found = await courseDB.find( 
            { selector: 
                { name: 
                    { $regex: `/${  idpre}.*` },
                },
            });
        // @ts-ignore
        const courses = found.docs.map( row => row.course );
        return courses;
    }
    finder()
    .then(result => ret=result)
    .catch(result => ret = [{ status:500, err: result }]);
    console.log(ret);
    return ret;
}


