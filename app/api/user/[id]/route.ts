import { NextRequest, NextResponse } from "next/server"

interface Props{
    params : {id :number}
}

export function GET(request: NextRequest, {params:{id}} : {params :{id:number}}){
    return NextResponse.json(id);
}
