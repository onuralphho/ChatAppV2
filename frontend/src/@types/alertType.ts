export interface IAlert{
    shown:boolean,
    type:string
}

export type AlertContextType = {
    alert:any,
    alertStarter:(message:string)=>void
}