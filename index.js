
import 'dotenv/config'
import axios from 'axios';
import { twitterClient } from './twitter';
import cloudinary from './cloudinary';

const getNumTwitterFollowers = async (handle) => {
  const data = await twitterClient.accountsAndUsers.usersSearch({ q: 'jamesqquick' });
  return data[0]?.followers_count;
}

const getImageURLWithFollowerText = async (count) => {
  
  try {
    const countWithCommas = count.toLocaleString("en-US");
    const url = cloudinary.url(process.env.CLOUDINARY_IMAGE_NAME, {
      transformation: [
        {
          overlay: {
            font_family: 'Poppins',
            font_size: 28,
            font_weight: 500,
            text: `${countWithCommas}`,
            text_align: 'right',
          },
          color: '#ffffff',
          y: '-130',
          x: '260',
          crop: 'limit',
          gravity: 'east',
        }
      ]});
      return url;
    }catch(err){
      console.error(err)
    }
}

const uploadImageTwitterBanner = async (imageUrl) => {
  const image = await axios.get(imageUrl, {
  responseType: 'arraybuffer',
  });
  const imageBase64 = Buffer.from(image.data).toString('base64');
  try {
    const res = await twitterClient.accountsAndUsers.accountUpdateProfileBanner({
      banner: imageBase64
    });
    console.log(res);
  } catch (error) {
    console.error(error)
  }
}

const twitterFollowers = await getNumTwitterFollowers();
const dynamicBannerURL = await getImageURLWithFollowerText(twitterFollowers);
await uploadImageTwitterBanner(dynamicBannerURL);