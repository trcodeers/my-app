import { useEffect, useState } from 'react';
import { getSearches, storeSearches } from "./services/indexdbService";
import InfiniteScroll from 'react-infinite-scroll-component';
import BasicModal from "./appModal";
import Panel from "./panel";
import CircularProgress from '@mui/material/CircularProgress';
import "./App.css";
import Snackbar from '@mui/material/Snackbar';


function App() {

  const [imageLists, setImageLists] = useState(null)
  const [imageUrls, setimageUrls] = useState(null)
  const [imagesMetaData, setImagesMetaData] = useState({
    page: 1,
    perpage: 100
  })

  const [searchSuggestion, setSearchSuggestion] = useState(null)

  const [imageListsOnSearch, setImageListsOnSearch] = useState(null)
  const [imageUrlsOnSearch, setImageUrlsOnSearch] = useState(null)
  const [searchImagesMetaData, setSearchImagesMetaData] = useState()

  const [scrollMore, setScrollMore] = useState(true)

  const [modalOpen, setModalOpen] = useState(false)
  const [modalsrc, setModalsrc] = useState(null)

  const [snackBarMessage, setSnackBarMessage] = useState('')
  const [displayLoader, setDisplayLoader] = useState(false)

  useEffect(() =>{
    getImages()
  }, [])

  useEffect(() =>{
    if(imageLists){
      const urls = imageLists.map((el) =>{
        const { id, secret, server } = el
        return getImageFullURL(server, id, secret)
      })
      setimageUrls(urls)
    }
  }, [imageLists])

  useEffect(() =>{
    if(imageListsOnSearch){
      const urls = imageListsOnSearch.map((el) =>{
        const { id, secret, server,  } = el
        return getImageFullURL(server, id, secret)
      })
      setImageUrlsOnSearch(urls)
    }
  }, [imageListsOnSearch])

  useEffect(() =>{
    if(imagesMetaData.page === imagesMetaData.pages){
      setScrollMore(false)
    }
  }, [imagesMetaData])

  const onSearch = async(search) => {
    setDisplayLoader(true)
      console.log('Processing search:', search);
      const data = await getImagesOnSearch(search)
      if(data.stat === 'ok'){
        console.log(data.photos.photo)
        setImageListsOnSearch(data.photos.photo)
        storeQuery(search)
      }
      else{
        if(search){
          setImageListsOnSearch([])
        }
        else{
          setImageListsOnSearch(null)
        }
        setSnackBarMessage(data.message)
      }
    setDisplayLoader(false)  
  } 
  
  const handleChange = async(e) => {
    const { value } = e.target;  

    if(!value){
      console.log('Input is blank', value)
      setImageUrlsOnSearch(null)
      setImageListsOnSearch(null)
      return
    }
    
    const searches = await getSearches(value)
    console.log(searches)
    if(searches)
      setSearchSuggestion([...searches])

    // onSearch(value);
  };

  const getImages = async() => {
    setDisplayLoader(true)
    console.log(imagesMetaData)
    const res = await fetch(`https://www.flickr.com/services/rest/?method=flickr.photos.getRecent&api_key=c875ad297514c0f27c7d03002bd9eac0&format=json&nojsoncallback=1&page=${imagesMetaData.page}`)
    const data = await res.json()
    const { photos } = data
    
    console.log(data)

    if(data.stat === 'ok'){
      setImageLists([ ...(photos?.photo || []), ...(imageLists || []) ])    
    
      setImagesMetaData({
        ...imagesMetaData,
        pages: photos.pages,
        page: imagesMetaData.page + 1
      })
    }
    else{
      setSnackBarMessage(data.message)
    }
    setDisplayLoader(false)
  }

  const getImageFullURL = (serverId, id, secret) =>{
    return `https://live.staticflickr.com/${serverId}/${id}_${secret}.jpg`
  }

  const getImagesOnSearch = async(search) =>{
    const res = await fetch(`https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=44a87a02fe66e208b44214b3d7315b76&text=${search}&format=json&nojsoncallback=1&auth_token=72157720883512437-3bb5b0d92faeedcf&api_sig=916cd173441c4725908ed231f3eb7d64`)
    const data = await res.json()
    console.log('Search result', data)
    return data
  }

  const storeQuery = (query) =>{
    console.log('Store the query', query)
    storeSearches(query)
  }

  const handleModalClose = () => setModalOpen(false);

  const onClickImage = (src) =>{
    setModalsrc(src)
    setModalOpen(true)
  }

  const snackBarHandleClose = () =>{
    setSnackBarMessage('')
  }

  return (
    <>
      
      <div className='topHeader'>
        <div className='searchField'>  
           <Panel 
            onSearch={onSearch} 
            handleChange={handleChange} 
            menuItems={searchSuggestion} 
          />
        </div>
      </div>

    {/* Images */}
   { 
      <InfiniteScroll
        dataLength={imageLists?.length || 0}
        next={getImages}
        hasMore={scrollMore}
        // loader={<div style={{ marginLeft: '40%' }}><CircularProgress /></div>}
      >
        <div className='imageListContainer'>
            {
              (imageUrlsOnSearch || imageUrls)?.map((el, index) =>{
                return(
                  <div onClick={() => onClickImage(el)} key={index}>
                    <img style={{ borderRadius: '5%' }} width={200} height={200} src={el} />  
                  </div>
                )
              })
            }
        </div>
      </InfiniteScroll>
    }

    <BasicModal
      open={modalOpen}
      handleClose={handleModalClose}
      src={modalsrc}
    />
     <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={snackBarMessage}
        onClose={snackBarHandleClose}
        message={snackBarMessage}
      />

      <div style={{ marginLeft: '45%' }}>
       {displayLoader && <CircularProgress/>}
      </div>
    </>
  );
}

export default App;
