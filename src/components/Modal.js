import { useState, useRef } from "react"

const Modal = ({ setModalOpen, setSelectedImage, selectedImage,generateVariations }) => {
    const [error, setError] = useState(null)
    const ref = useRef(null)

    const closeModal = () => {
        setModalOpen(false)
        setSelectedImage(null)
    }
    const checkSize = () => {
        console.log(ref);
        if (ref.current.width == 256 && ref.current.height == 256) {
            generateVariations()
        } else {
            setError('Error: Choose 256 x 256 image')
        }
    }
    return (
        <div className="modal">
            <div onClick={closeModal}>✖</div>
            <div className="imgContainer">
                {selectedImage && <img src={URL.createObjectURL(selectedImage)} alt="uploaded" ref={ref} />}
            </div>
            <p>{error || "* Image must be 256 x 256"}</p>
            {!error && <button onClick={checkSize}>Generate</button>}
            {error && <button onClick={closeModal}>Close and try again</button>}
        </div>
    )
}
export default Modal