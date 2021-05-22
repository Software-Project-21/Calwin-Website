import React, { useState } from 'react';
import firebase from '../../firbase';
import './tags.css';

const db = firebase.firestore();

function EmailTags(props) {

    const [error,setError] = useState(null);
    const [value,setValue] = useState('');

    const handleDelete = item => {
        props.setPid(props.pid.filter(i => i.email!==item));
        // props.setPeople(props.people.filter(i => i!==item));
    }

    const handleChange = e => {
        setValue(e.target.value);
        setError(null);
    }

    const handleKeyDown = async e => {
        if(["Enter","Tab", ","].includes(e.key)) {
            var val = value.trim();
            if(val && (await isValid(val))){
                // props.setPeople((prev) => ([
                //     ...prev,
                //     val
                // ]));
                await setId(val);
                setValue("");
            }
        }
    }

    const setId = async (val) => {
        var arr = [...props.pid];
        await db.collection('users').get().then((qSnap) => {
            qSnap.forEach((doc) => {
                // console.log(doc.data().email);
                // console.log(val);
                if(doc.data().email===val){
                    console.log("yes");
                    arr.push({
                        email: val,
                        id: doc.id  
                    });
                    // props.setPid((prev) => [
                    //     ...prev,
                    //     doc.id
                    // ])
                }
            })
        })
        props.setPid(arr);
        console.log(arr);
    }

    const handlePaste = e => {
        e.preventDefault();

        var paste = e.clipboardData.getData("text");
        var emails = paste.match(/[\w\d\.-]+@[\w\d\.-]+\.[\w\d\.-]+/g);

        if (emails) {
            var toBeAdded = emails.filter(email => !isInList(email));

            props.setPeople((prev) => ([
                ...prev,
                ...toBeAdded
            ]))
        }
    };

    async function isValid(email) {
        let err = null;
        // console.log(isCalwinUser(email));
        if(!(await isCalwinUser(email))){
            err = `${email} is not a CalWin User.` ;
        }
        // console.log(isInList(email));
        if (isInList(email)) {
        err = `${email} has already been added.`;
        }

        if (!isEmail(email)) {
        err = `${email} is not a valid email address.`;
        }

        if (err) {
        setError(err);
        return false;
        }

        return true;
    }

    async function isCalwinUser(email){
        // console.log("ye kya");
        // console.log(email);
        var userRef = db.collection('users');
        var query = userRef.where("email", "==", email);
        let snap =  await query.get();
        // console.log(snap.empty);
        // snap.forEach(doc => {
        //     if(!doc.exists){
        //         console.log("hai ni");
        //     } else
        //     console.log(doc.data());
        // });
        if(snap.empty){
            return false;
        } else {

            // query.get().then((qSnap) => {
            //     qSnap.forEach((doc) => {
            //         console.log(props.pid.includes(doc.id,0));
            //         // console.log(doc.id);
            //         if(props.pid.includes(doc.id,0) === false){
            //             props.setPid((prev) => [
            //                 ...prev,
            //                 doc.id
            //             ])
            //         }
            //     });
            // })
            // console.log(props.pid);
            return true;
        }


        // iit2019080@iiita.ac.in

        // if((await db.collection('users').where('email', '==' , email).get()).empty){
        //     return false;
        // } else return false;
        // console.log("ho rha hai");
        // var ans;
        // db.collection('users').where('email', '==' , email)
        // .get()
        // .then((querySnap) => {
        //     console.log(querySnap.empty);
        //     if(querySnap.empty === true){
        //         ans = false;
        //         // return false;
        //     }
        // }).catch((err) => {
        //     console.log(err);
        // })
        // console.log(ans);
        // if(ans===false) return ans;
        // else return true;
    }

    function isInList(email) {
        return props.pid.some(el => el.email === email);
    }

    function isEmail(email) {
        return /[\w\d\.-]+@[\w\d\.-]+\.[\w\d\.-]+/.test(email);
    }

    return (
        <>
        <h2>Add People</h2>
        {props.pid.map(item => (
          <div className="tag-item" key={item.email}>
            {item.email}
            <button
              type="button"
              className="button"
              onClick={() => handleDelete(item.email)}
            >
              &times;
            </button>
          </div>
        ))}

        <input
          className={"input " + (error && " has-error")}
          value={value}
          placeholder="Type or paste email addresses and press `Enter`..."
          onKeyDown={handleKeyDown}
          onChange={handleChange}
          onPaste={handlePaste}
        />

        {error && <p className="error">{error}</p>}
      </>
    );
}

export default EmailTags;