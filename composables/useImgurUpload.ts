import axios from 'axios';

/**
 * 画像をアップロードする
 */
const useImgurUpload = async (img: string) => {
    const res = await axios.post(
        'https://dotart-backend.herokuapp.com/api/v1/image-uploader',
        {
            image: img,
        }
    );
    return res.data.data;
};
export default useImgurUpload;
