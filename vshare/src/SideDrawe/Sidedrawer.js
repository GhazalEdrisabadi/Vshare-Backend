import React from 'react'
import'./Sidedrawer.css'

const SlideDrawer = props => (
    <nav className="side-drawer">
        <ul>
            <li><a href="/profile">پروفایل</a></li>
            <li><a href="/edit">ویرایش اطلاعات</a></li>
            <li><a href="/call">تماس با ما</a></li>
            <li><a href="/exit">خروج</a></li>
        </ul>
    </nav>
    );
export default SlideDrawer