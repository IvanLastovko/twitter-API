import React, {RefObject, useRef, useState} from "react";
//
// interface Props {
//     text: string
//     handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void
// }
//
// export const TextField: React.FC<Props> = ({text, handleChange}) => {
//
//     const [textField, setTextField] = useState<string>(text)
//
//     const [count, setCount] = useState<{ text: string }>({text: 'hello'})
//     const inputRef = useRef<HTMLInputElement | null>(null)
//     const divRef = useRef<HTMLInputElement | null>(null)
//
//
//     return (
//         <div ref={divRef}>
//             <input type="text" autoFocus defaultValue={textField} onChange={handleChange}/>
//             <input type="text" ref={inputRef}/>
//         </div>
//     );
//
// }
