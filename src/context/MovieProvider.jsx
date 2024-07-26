import { createContext, useState } from "react";
import YouTube from 'react-youtube';
import Modal from 'react-modal';

const opts = {
    height: '390',
    width: '640',
    playerVars: {
        // https://developers.google.com/youtube/player_parameters
        autoplay: 1,
    },
};

const MovieContext = createContext();

const MovieProvider = ({ children }) => {
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
        <MovieContext.Provider value={{ handleTrailer }}>
            {children}
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
        </MovieContext.Provider>
    );
}
export { MovieProvider, MovieContext };
export default MovieProvider; 