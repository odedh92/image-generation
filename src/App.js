import { useState } from 'react';
import Modal from './components/Modal'

const App = () => {
  const [images, setImages] = useState(null)
  const [value, setValue] = useState(null)
  const [error, setError] = useState(null)
  const [selectedImage, setSelectedImage] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)


  const supriseOptions = [
    'A Golden retriever eating melon',
    'A Matisse-style shark on the telephone',
    'A pineapple sunbathing on an island',
    'Mystical Forest at Dusk',
    'Steampunk Cityscape',
    'Underwater Alien World',
    'Fantasy Castle in the Clouds',
    'Robotic Wildlife',
    'Post-Apocalyptic City Ruins',
    'Ancient Civilization on Mars'
  ];
  const surpriseMe = () => {
    setImages(null)
    const randomValue = supriseOptions[Math.floor(Math.random() * supriseOptions.length)]
    setValue(randomValue)
  }

  const uploadImage = async (e) => {
    const formData = new FormData()
    formData.append('file', e.target.files[0])
    setModalOpen(true)
    setSelectedImage(e.target.files[0])
    e.target.value = 'null'
    try {
      const options = {
        method: "POST",
        body: formData
      }
      const response = await fetch('http://localhost:8000/upload', options)
      const data = await response.json()
      setImages(data)
    } catch (error) {
      console.log(error);
    }
  }
  const generateVariations = async () => {
    setImages(null)
    if (selectedImage === null) {
      setError('Error! Must have an existing image')
      setModalOpen(false)
      return
    }
    try {
      const options = {
        method: 'POST',
      }
      const response = await fetch('http://localhost:8000/variations', options)
      const data = await response.json()
      setImages(data)
      setError(null)
      setModalOpen(false)
    } catch (error) {
      console.log(error);
    }
  }

  const getImages = async () => {
    setImages(null)
    if (value === null) {
      setError('Error! Must have a search term')
      return
    }
    try {
      const options = {
        method: 'POST',
        body: JSON.stringify({
          message: value
        }),
        headers: {
          "Content-Type": "application/json"
        }
      }
      const response = await fetch('http://localhost:8000/images', options)
      const data = await response.json()
      setImages(data)
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className='app'>
      <section className='searchSection'>
        <p>
          Start with a detailed description{' '}
          <span className='surprise' onClick={surpriseMe}>Surprise me</span>
        </p>
        <div className='inputContainer'>
          <input placeholder='A Tennis ball on a basketball cart' onChange={e => setValue(e.target.value)} value={value} />
          <button onClick={getImages}>Generate</button>
        </div>
        <p className='extraInfo'>Or,
          <span>
            <label htmlFor='files' className='uploadLabel'> upload an image  to edit. </label>
            <input onChange={uploadImage} id='file' accept='image/*' type='file' />
          </span>
        </p>
        {error && <p>{error}</p>}
        {modalOpen && <div className="overlay">
          <Modal setModalOpen={setModalOpen}
            setSelectedImage={setSelectedImage}
            selectedImage={selectedImage}
            generateVariations={generateVariations} />
        </div>
        }
      </section>
      <section className='imageSection'>
      {Array.isArray(images) && images.map((image, index) => (
          <img key={index} src={image.url} alt={`Generated of ${value}`} />
        ))}
      </section>
    </div>
  );
};

export default App;
