import React, { useState } from 'react'
import PropTypes from 'prop-types'
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import YouTube from 'react-youtube';
import Modal from 'react-modal';


const responsive = {
    superLargeDesktop: {
        breakpoint: { max: 4000, min: 3000 },
        items: 10
    },
    desktop: {
        breakpoint: { max: 3000, min: 1200 },
        items: 8
    },
    tablet: {
        breakpoint: { max: 1200, min: 600 },
        items: 4
    },
    mobile: {
        breakpoint: { max: 600, min: 0 },
        items: 1
    }
};

const opts = {
    height: '390',
    width: '640',
    playerVars: {
        // https://developers.google.com/youtube/player_parameters
        autoplay: 1,
    },
};


const MovieList = ({ title, data }) => {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [trailerKey, setTrailerKey] = useState('');

    const handleTrailer = async (id) => {
        setTrailerKey('')
        try {
            const url = `https://api.themoviedb.org/3/movie/${id}/videos?language=vi`;
            const option = {
                method: 'GET',
                headers: {
                    accept: 'application/json',
                    Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`
                }
            }
            const movieKey = await fetch(url, option);
            const data = await movieKey.json();
            console.log(data);
            setTrailerKey(data.results[0].key)
            setModalIsOpen(true)
        } catch (error) {
            setModalIsOpen(false)
            console.log(error);
        }
    }
    return (
        <div className='text-white p-10 mb-10 items-center'>
            <h2 className='uppercase text-xl mb-4'>{title}</h2>
            <Carousel responsive={responsive} className='flex items-center space-x-4 justify-center'>
                {
                    data && data.map((item, index) => {
                        return (
                            <div className='w-[200px] h-[300px] relative group overflow-hidden' key={'data-' + index} onClick={() => handleTrailer(item.id)}>
                                <div className='group-hover:scale-105 transition-transform duration-500 ease-in-out w-full h-full cursor-pointer '>
                                    <div className='absolute top-0 left-0 w-full h-full bg-black/40' />
                                    <img src={import.meta.env.VITE_IMG_URL + item.poster_path} alt={item.title} className='w-full h-full object-cover ' />
                                    <div className='absolute bottom-4 left-2'>
                                        <p className='uppercase text-md'>
                                            {item.title || item.original_title}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                }
            </Carousel>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={() => setModalIsOpen(false)}
                style={{
                    overlay: {
                        position: 'fixed',
                        zIndex: 1000,
                    },
                    content: {
                        top: "50%",
                        left: "50%",
                        right: "auto",
                        bottom: "auto",
                        marginRight: "-50%",
                        transform: "translate(-50%,-50%)",
                    },
                }}
                contentLabel="Example Modal"
            >
                <YouTube videoId={trailerKey} opts={opts} />
            </Modal>
        </div>
    )
}
MovieList.propTypes = {
    title: PropTypes.string,
    data: PropTypes.array
}
export default MovieList