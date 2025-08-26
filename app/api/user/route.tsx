import { NextRequest, NextResponse } from "next/server";



const users = [
  { "userId": 1, "name": "Kasun Chamara", "email": "kasun@example.com", "password": "Pass@123" },
  { "userId": 2, "name": "Anjali Perera", "email": "anjali.p@example.com", "password": "Hello@456" },
  { "userId": 3, "name": "Nimal Silva", "email": "nimal.s@example.com", "password": "Secure@789" },
  { "userId": 4, "name": "Kavindu Jayasuriya", "email": "kavindu.j@example.com", "password": "MyPass@111" },
  { "userId": 5, "name": "Tharushi Fernando", "email": "tharushi.f@example.com", "password": "Test@222" },
  { "userId": 6, "name": "Sandun Abeysekara", "email": "sandun.a@example.com", "password": "User@333" },
  { "userId": 7, "name": "Ishara Madushani", "email": "ishara.m@example.com", "password": "Demo@444" },
  { "userId": 8, "name": "Malith Weerasinghe", "email": "malith.w@example.com", "password": "Pass@555" },
  { "userId": 9, "name": "Dinithi Karunaratne", "email": "dinithi.k@example.com", "password": "Login@666" },
  { "userId": 10, "name": "Supun Dissanayake", "email": "supun.d@example.com", "password": "Secret@777" }
]


export function GET(request : NextRequest ){
    return NextResponse.json({data : `your penis`});
}

export async function POST (request : NextRequest){
    const body  = await request.json();   // request.json() is asynchronous
    
    return NextResponse.json(body);

}