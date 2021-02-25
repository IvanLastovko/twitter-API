# If you want to try it yourself on your computer then you'll need a 'firebase_config.ts' file placed into /src folder.
## Copy this code into the file and replace variables in object with strings

```
import {FirebaseConfigInterface} from "./interfaces/FirebaseConfigInterface";

export const firebase_config: FirebaseConfigInterface = {
    apiKey: apiKey,
    authDomain: authDomain,
    projectId: projectId,
    storageBucket: storageBucket,
    messagingSenderId: messagingSenderId,
    appId:appId,
    measurementId: measurementId
}
```
