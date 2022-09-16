import { NextResponse, NextRequest } from 'next/server'
export async function middleware(req: any, ev:any) {
    // console.log(req.nextUrl);
    const { pathname, origin  } = req.nextUrl
    if (pathname == '/') {
        return NextResponse.redirect(`${origin}/swap`)
    }
    return NextResponse.next()
}