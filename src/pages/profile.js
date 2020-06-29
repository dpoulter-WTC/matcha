import React from "react"
import Layout from "../components/layout"
import "../styles/profile.css"

import ImageGallery from 'react-image-gallery';
import "react-image-gallery/styles/css/image-gallery.css";


const images = [
    {
        original: 'https://picsum.photos/id/1018/1000/600/',
        thumbnail: 'https://picsum.photos/id/1018/250/150/',
        description: "Hello",
    },
    {
        original: 'https://picsum.photos/id/1015/1000/600/',
        thumbnail: 'https://picsum.photos/id/1015/250/150/',
        description: "This",
    },
    {
        original: 'https://picsum.photos/id/1019/1000/600/',
        thumbnail: 'https://picsum.photos/id/1019/250/150/',
        description: "Test",
    },
];

export default function Profile() {
    return (
        <Layout>
            <div className="background">
                <div className="content">

                    <div className="header">
                        <div className="headercontent">
                            <div className="left">
                                <img src="https://placebear.com/200/200" style={{ paddingRight: "25px" }} />
                                <span className="name">Name here</span>
                            </div>
                            <div className="right">
                                <button>Send Message</button>
                            </div>
                        </div>
                    </div>

                    <div className="mainBody">
                        <div className="images">
                            <ImageGallery items={images} showPlayButton={false}/>
                        </div>
                        <div className="sideBar">text</div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}