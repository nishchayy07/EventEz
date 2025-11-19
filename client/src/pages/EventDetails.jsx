import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Music } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import Loading from '../components/Loading';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { axios } = useAppContext();
  const [event, setEvent] = useState(null);
  const [relatedEvents, setRelatedEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    const fetchEventDetails = async () => {
      setLoading(true);
      try {
        // Fetch the specific event from database
        const { data } = await axios.get(`/api/nightlife/event/${id}`);
        if (data.success && data.event) {
          setEvent(data.event);
          
          // Fetch related events of the same category
          const relatedData = await axios.get(`/api/nightlife/events/${data.event.category}`);
          if (relatedData.data.success) {
            // Filter out current event and limit to 4
            const related = relatedData.data.events
              .filter(e => e._id !== id)
              .slice(0, 4);
            setRelatedEvents(related);
          }
        }
      } catch (error) {
        console.error('Error fetching event details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [id, axios]);

  if (loading) {
    return <Loading />;
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Event Not Found</h2>
          <p className="text-gray-400">The event you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const events = [
    {
      id: '1',
      title: 'Saturday Night Live',
      venue: 'Ophelia Lounge',
      location: 'Delhi/NCR',
      date: '2025-11-09T20:00:00',
      price: '₹2999',
      image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7',
      landscapeImage: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1920&h=1080&fit=crop',
      category: 'Concerts',
      description: 'Join us for an unforgettable night of music and entertainment at Ophelia Lounge. Experience the best of live music in a stunning atmosphere.',
      artist: 'Alan Walker',
      artistImage: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSjvzynJWBIjCjHQjr6OOqzR3aeykwL3Qzt8vHtd66I_fhVIl5Q6CkATkRUTaJmTtFPChG-1p8YqjU1rWpEN8j5g-r8bpviLJnmuHI4Tck&s=10',
      duration: '3 hours',
      ageRestriction: '21+',
    },
    {
      id: '2',
      title: 'Kisi ko Batana Mat ft. Anubhav Singh Bassi',
      venue: 'The Laugh Club',
      location: 'Delhi/NCR',
      date: '2025-11-10T21:00:00',
      price: '₹1299',
      image: 'https://assets-in.bmscdn.com/discovery-catalog/events/tr:w-400,h-600,bg-CCCCCC:w-400.0,h-660.0,cm-pad_resize,bg-000000,fo-top:l-text,ie-U3VuLCAxNiBOb3Y%3D,fs-29,co-FFFFFF,ly-612,lx-24,pa-8_0_0_0,l-end/et00355125-zfdunhwukb-portrait.jpg',
      landscapeImage: 'https://assets-in.bmscdn.com/nmcms/events/banner/desktop/media-desktop-kisi-ko-batana-mat-ft-anubhav-singh-bassi-0-2025-3-9-t-8-12-52.jpg',
      category: 'Comedy Shows',
      description: 'Get ready for a night of laughter with the best comedians in town.',
      artist: 'Anubhav Singh Bassi',
      artistImage: 'https://i0.wp.com/deadant.co/wp-content/uploads/2023/07/DA-WEBSITE-34.png?fit=1350%2C650&ssl=1',
      duration: '2 hours',
      ageRestriction: '16+',
    },
    {
      id: '3',
      title: 'Samay Raina-Still Alive and Unfiltered',
      venue: 'Indira Gandhi Indoor Stadium',
      location: 'Delhi/NCR',
      date: '2025-11-09T20:00:00',
      price: '₹4499',
      image: 'https://assets-in.bmscdn.com/discovery-catalog/events/tr:w-400,h-600,bg-CCCCCC:w-400.0,h-660.0,cm-pad_resize,bg-000000,fo-top:l-text,ie-TW9uLCAxNyBOb3Ygb253YXJkcw%3D%3D,fs-29,co-FFFFFF,ly-612,lx-24,pa-8_0_0_0,l-end:l-text,ie-UFJPTU9URUQ%3D,co-FFFFFF,bg-DC354B,ff-Roboto,fs-20,lx-N16,ly-12,lfo-top_right,pa-12_14_12_14,r-6,l-end/et00454335-hqmbkqumjp-portrait.jpg',
      landscapeImage: 'https://assets-in.bmscdn.com/nmcms/events/banner/desktop/media-desktop-samay-raina-still-alive-unfiltered-0-2025-9-10-t-10-14-30.jpg',
      category: 'Comedy Shows',
      description: 'Get ready for a night of laughter with the best comedians in town.',
      artist: 'Samay Raina',
      artistImage: 'https://yt3.googleusercontent.com/ytc/AIdro_msUercxyRDA0NKQsaIS0IXMTCF_GId4oiTzQYyKbP4AI4=s900-c-k-c0x00ffffff-no-rj',
      duration: '2 hours',
      ageRestriction: '18+',
    },
    {
      id: '4',
      title: 'Kuch Bhi Ho Sakta Hai - Delhi Theatre Festival',
      venue: 'Nehru Stadium',
      location: 'Delhi/NCR',
      date: '2025-11-10T20:00:00',
      price: '₹499',
      image: 'https://assets-in.bmscdn.com/discovery-catalog/events/tr:w-400,h-600,bg-CCCCCC:w-400.0,h-660.0,cm-pad_resize,bg-000000,fo-top:l-text,ie-U3VuLCAxNiBOb3Y%3D,fs-29,co-FFFFFF,ly-612,lx-24,pa-8_0_0_0,l-end:l-text,ie-UFJPTU9URUQ%3D,co-FFFFFF,bg-DC354B,ff-Roboto,fs-20,lx-N16,ly-12,lfo-top_right,pa-12_14_12_14,r-6,l-end/et00462375-uruhvkracx-portrait.jpg',
      landscapeImage: 'https://assets-in.bmscdn.com/nmcms/events/banner/desktop/media-desktop-kuch-bhi-ho-sakta-hai-delhi-theatre-festival-0-2025-11-3-t-17-47-9.jpg',
      category: 'Theatre Shows',
      description: 'This is the journey of a man who should have been a failure, one who manipulated his destiny and forced it to become a success. Never before, in the history of theatre, has the autobiography of an actor been dramatized on stage, especially when he is still practising his craft. The play will be staged as a full production with Anupam narrating and dramatising the important events in his life, e.g. first romantic encounter, failure at Gandhi audition, casting in Saaraansh, awards, personal relationships, etc.',
      artist: 'Anupam Kher',
      artistImage: 'https://www.hindustantimes.com/ht-img/img/2024/04/20/550x309/Anupam_Kher_1713620401279_1713620461173.jpg',
      duration: '2 hours',
      ageRestriction: '18+',
    },
    {
      id: '5',
      title: 'Einstein 15th Nov - Delhi Theatre Festival',
      venue: 'Nehru Stadium',
      location: 'Delhi/NCR',
      date: '2025-11-15T22:00:00',
      price: '₹999',
      image: 'https://assets-in.bmscdn.com/discovery-catalog/events/tr:w-400,h-600,bg-CCCCCC:w-400.0,h-660.0,cm-pad_resize,bg-000000,fo-top:l-text,ie-U2F0LCAxNSBOb3Y%3D,fs-29,co-FFFFFF,ly-612,lx-24,pa-8_0_0_0,l-end/et00462380-nxjnvwzxep-portrait.jpg',
      landscapeImage: 'https://assets-in.bmscdn.com/nmcms/events/banner/desktop/media-desktop-einstein-15th-nov-delhi-theatre-festival-0-2025-11-3-t-17-40-17.jpg',
      category: 'Theatre Shows',
      description: 'This is the journey of a man who should have been a failure, one who manipulated his destiny and forced it to become a success. Never before, in the history of theatre, has the autobiography of an actor been dramatized on stage, especially when he is still practising his craft. The play will be staged as a full production with Anupam narrating and dramatising the important events in his life, e.g. first romantic encounter, failure at Gandhi audition, casting in Saaraansh, awards, personal relationships, etc.',
      artist: 'DJ Snake',
      artistImage: 'https://i.scdn.co/image/ab6761610000e5eb9e3acf1eaf3b8846e836f441',
      duration: '2 hours',
      ageRestriction: '18+',
    },
    {
      id: '6',
      title: 'AP Dhillon: One Of One Tour - Mumbai',
      venue: 'Jio World Convention Centre: Mumbai',
      location: 'Mumbai',
      date: '2025-12-26T19:00:00',
      price: '₹1299',
      image: 'https://assets-in.bmscdn.com/discovery-catalog/events/tr:w-400,h-600,bg-CCCCCC:w-400.0,h-660.0,cm-pad_resize,bg-000000,fo-top:l-text,ie-RnJpLCAyNiBEZWM%3D,fs-29,co-FFFFFF,ly-612,lx-24,pa-8_0_0_0,l-end/et00458408-csskcxnekn-portrait.jpg',
      landscapeImage: 'https://assets-in.bmscdn.com/nmcms/events/banner/desktop/media-desktop-ap-dhillon-one-of-one-tour-mumbai-0-2025-9-28-t-7-29-2.jpg',
      category: 'Concerts',
      description: 'Get ready for an unforgettable musical celebration as AP Dhillon the ultimate force in music returns to India with a power-packed One Of One tour presented by Team Innovation! Known for global chart-toppers like Thodi Si Daaru, Excuses, and With You, AP Dhillon brings his signature blend of Punjabi hip-hop, pop, R&amp;B, and trap to stages across the country. This electrifying tour promises high-energy performances, cutting-edge production, and an immersive concert atmosphere that will leave fans spellbound. Whether youre a day-one fan or new to his sound, this is your chance to witness the global phenomenon live and loud. Don’t miss the most awaited tour of the year — experience the vibe, the music, and the magic of AP Dhillon: One Of One India Tour 2025.',
      artist: 'AP Dhillon',
      artistImage: 'https://i.pinimg.com/474x/e9/f8/85/e9f8859be9e7c1d131c0a53d3604b077.jpg',
      duration: '2 hours',
      ageRestriction: '18+',
    },
    {
      id: '7',
      title: 'Satrangi Re by Sonu Nigam',
      venue: 'Nehru Stadium, Delhi',
      location: 'Delhi',
      date: '2025-12-26T19:00:00',
      price: '₹1299',
      image: 'https://assets-in.bmscdn.com/discovery-catalog/events/tr:w-400,h-600,bg-CCCCCC:w-400.0,h-660.0,cm-pad_resize,bg-000000,fo-top:l-text,ie-U2F0LCAyOCBNYXI%3D,fs-29,co-FFFFFF,ly-612,lx-24,pa-8_0_0_0,l-end/et00455992-cskuwbmxvk-portrait.jpg',
      landscapeImage: 'https://assets-in.bmscdn.com/nmcms/events/banner/desktop/media-desktop-satrangi-re-by-sonu-nigam-0-2025-7-30-t-7-12-36.jpg',
      category: 'Concerts',
      artist: 'Sonu Nigam',
      artistImage: 'https://img.staticmb.com/mbcontent/images/crop/uploads/2023/5/sonu-nigam-house_0_1200.jpg.webp',
      description: 'Get ready for an unforgettable musical celebration as AP Dhillon the ultimate force in music returns to India with a power-packed One Of One tour presented by Team Innovation! Known for global chart-toppers like Thodi Si Daaru, Excuses, and With You, AP Dhillon brings his signature blend of Punjabi hip-hop, pop, R&amp;B, and trap to stages across the country. This electrifying tour promises high-energy performances, cutting-edge production, and an immersive concert atmosphere that will leave fans spellbound. Whether youre a day-one fan or new to his sound, this is your chance to witness the global phenomenon live and loud. Don’t miss the most awaited tour of the year — experience the vibe, the music, and the magic of AP Dhillon: One Of One India Tour 2025.',
      duration: '2 hours',
      ageRestriction: '18+',
    },
    {
      id: '8',
      title: 'Kal ki Chinta Nahi Karta ft. Ravi Gupta',
      venue: 'CP67 Mall:Mohali',
      location: 'Chandigarh',
      date: '2025-12-26T19:00:00',
      price: '₹499',
      image: 'https://assets-in.bmscdn.com/discovery-catalog/events/tr:w-400,h-600,bg-CCCCCC:w-400.0,h-660.0,cm-pad_resize,bg-000000,fo-top:l-text,ie-U2F0LCAxNSBOb3Y%3D,fs-29,co-FFFFFF,ly-612,lx-24,pa-8_0_0_0,l-end/et00329412-wqddascxcw-portrait.jpg',
      landscapeImage: 'https://assets-in.bmscdn.com/nmcms/desktop/media-desktop-kal-ki-chinta-nahi-karta-ft-ravi-gupta-2025-4-17-t-14-55-45.jpg',
      category: 'Comedy Shows',
      description: 'Forget your Kal ki Chinta and Join us in this super funny Show by Ravi Gupta. Kal Ki Chinta Nahi Karta is new stand up special by Ravi Gupta.',
      artist: 'Ravi Gupta',
      artistImage: 'https://i0.wp.com/deadant.co/wp-content/uploads/2023/06/DA-WEBSITE-19.png?fit=1350%2C650&ssl=1',
      duration: '2 hours',
      ageRestriction: '18+',
    },
    {
      id: '9',
      title: 'Daily ka Kaam hai by Aakash Gupta',
      venue: 'CP67 Mall:Mohali',
      location: 'Chandigarh',
      date: '2025-12-26T19:00:00',
      price: '₹499',
      image: 'https://assets-in.bmscdn.com/discovery-catalog/events/tr:w-400,h-600,bg-CCCCCC:w-400.0,h-660.0,cm-pad_resize,bg-000000,fo-top:l-text,ie-U3VuLCAxNiBOb3Y%3D,fs-29,co-FFFFFF,ly-612,lx-24,pa-8_0_0_0,l-end/et00419828-rtfdvqpztg-portrait.jpg',
      landscapeImage: 'https://assets-in.bmscdn.com/nmcms/events/banner/desktop/media-desktop-daily-ka-kaam-hai-by-aakash-gupta-0-2025-10-26-t-19-59-1.jpg',
      category: 'Comedy Shows',
      description: 'Stories from his childhood home to his first MNC job after graduation, this show gets more personal, more awkward and even more hilarious. Is show ko dekhne k baad aap samjah jayengey ki &nbsp;Embarassing aur tragic situations Mei fasna Aakash ka daily ka kaam hai.',
      artist: 'Aakash Gupta',
      artistImage: 'https://yt3.googleusercontent.com/ytc/AIdro_kWjbRKzOhX9prGuQCFMFvttIQmuoOGJkczm4HPOWk5OWw=s900-c-k-c0x00ffffff-no-rj',
      duration: '2 hours',
      ageRestriction: '18+',
    },
    {
      id: '10',
      title: 'Gaurav Kapoor Live',
      venue: 'CP67 Mall:Mohali',
      location: 'Chandigarh',
      date: '2025-12-26T20:00:00',
      price: '₹499',
      image: 'https://assets-in.bmscdn.com/discovery-catalog/events/tr:w-400,h-600,bg-CCCCCC:w-400.0,h-660.0,cm-pad_resize,bg-000000,fo-top:l-text,ie-U3VuLCAyMSBEZWM%3D,fs-29,co-FFFFFF,ly-612,lx-24,pa-8_0_0_0,l-end/et00331714-blzqtszsvj-portrait.jpg',
      landscapeImage: 'https://assets-in.bmscdn.com/nmcms/events/banner/desktop/media-desktop-gaurav-kapoor-live-0-2025-3-12-t-13-37-5.jpg',
      category: 'Comedy Shows',
      description: 'He is so hilarious that you will think he is delirious.',
      artist: 'Gaurav Kapoor',
      artistImage: 'https://media.licdn.com/dms/image/v2/C5622AQGXVHQ5W980UA/feedshare-shrink_800/feedshare-shrink_800/0/1661914163746?e=2147483647&v=beta&t=Rltwy9hAoAgrKx71lqaMTV6z4kTSG03X9tzTgT-y4gw',
      duration: '2 hours',
      ageRestriction: '18+',
    },
    {
      id: '11',
      title: 'Sufi Night',
      venue: 'CP67 Mall:Mohali',
      location: 'Chandigarh',
      date: '2025-12-26T20:00:00',
      price: '₹999',
      image: 'https://assets-in.bmscdn.com/discovery-catalog/events/tr:w-400,h-600,bg-CCCCCC:w-400.0,h-660.0,cm-pad_resize,bg-000000,fo-top:l-text,ie-U3VuLCAyMyBOb3Y%3D,fs-29,co-FFFFFF,ly-612,lx-24,pa-8_0_0_0,l-end/et00468484-exlkezngpn-portrait.jpg',
      landscapeImage: 'https://assets-in.bmscdn.com/nmcms/events/banner/desktop/media-desktop-sufi-night-0-2025-10-28-t-9-1-58.jpg',
      category: 'Qawali Night',
      description: 'Experience an enchanting evening of soulful melodies and divine rhythm.The legendary qawwals will bring alive the timeless spirit of Sufism through powerful poetry, mesmerizing vocals, and heartfelt devotion.',
      artist: 'Nizami Brothers',
      artistImage: 'https://i.scdn.co/image/ab6761610000e5eb429a87a8f1a8a0cf2718d30f',
      duration: '1 hour 30 minutes',
      ageRestriction: '18+',
    },
    {
      id: '12',
      title: 'The Night Before Tomorrow: A The Weeknd Fan Event',
      venue: 'CP67 Mall:Mohali',
      location: 'Chandigarh',
      date: '2025-11-15T20:00:00',
      price: '₹4999',
      image: 'https://assets-in.bmscdn.com/discovery-catalog/events/tr:w-400,h-600,bg-CCCCCC:w-400.0,h-660.0,cm-pad_resize,bg-000000,fo-top:l-text,ie-U2F0LCAyOSBOb3Y%3D,fs-29,co-FFFFFF,ly-612,lx-24,pa-8_0_0_0,l-end/et00468465-uhkdaplggf-portrait.jpg',
      landscapeImage: 'https://assets-in.bmscdn.com/nmcms/events/banner/desktop/media-desktop-the-night-before-tomorrow-a-the-weeknd-fan-event-0-2025-10-28-t-7-31-58.jpg',
      category: 'Concerts',
      description: 'XO Fam this one for you.',
      artist: 'The Weeknd',
      artistImage: 'https://i.redd.it/eryv2nlhmdg91.jpg',
      duration: '4 hours',
      ageRestriction: '18+',
    },
    {
      id: '13',
      title: 'HUMARE RAM Ft Ashutosh Rana and Rahull R Bhuchar',
      venue: 'Kedarnath Sahni Auditorium: Delhi',
      location: 'Delhi',
      date: '2025-11-17T22:00:00',
      price: '₹899',
      image: 'https://assets-in.bmscdn.com/discovery-catalog/events/tr:w-400,h-600,bg-CCCCCC:w-400.0,h-660.0,cm-pad_resize,bg-000000,fo-top:l-text,ie-RnJpLCAxNCBOb3Ygb253YXJkcw%3D%3D,fs-29,co-FFFFFF,ly-612,lx-24,pa-8_0_0_0,l-end/et00376688-nansgzqfxr-portrait.jpg',
      landscapeImage: 'https://assets-in.bmscdn.com/nmcms/events/banner/desktop/media-desktop-humare-ram-ft-ashutosh-rana-and-rahull-r-bhuchar-0-2025-6-13-t-9-9-11.jpg',
      category: 'Theatre Shows',
      description: 'Humare Ram is a monumental theatrical production that has captivated audiences across India with its innovative portrayal of the epic Ramayana. Since its premiere, the play has successfully staged over 200 performances in more than 20 cities, including Mumbai, Delhi, Bangalore, Hyderabad, and Kolkata, attracting an audience exceeding 500,000 attendees. Prestigious venues such as the Nita Mukesh Ambani Cultural Centre (NMACC), Siri Fort Auditorium, Kamani Auditorium, Jamshed Bhabha Theatre, NCPA and &nbsp;have hosted this grand spectacle, underscoring its widespread acclaim.',
      duration: '3 hours',
      ageRestriction: '3+',
    },
    {
      id: '14',
      title: 'Sir Sir Sarla - Delhi Theatre Festival',
      venue: 'Kedarnath Sahni Auditorium: Delhi',
      location: 'Delhi',
      date: '2025-11-17T22:00:00',
      price: '₹899',
      image: 'https://assets-in.bmscdn.com/discovery-catalog/events/tr:w-400,h-600,bg-CCCCCC:w-400.0,h-660.0,cm-pad_resize,bg-000000,fo-top:l-text,ie-U2F0LCAxNSBOb3Y%3D,fs-29,co-FFFFFF,ly-612,lx-24,pa-8_0_0_0,l-end/et00462378-ggbwsjvfbe-portrait.jpg',
      landscapeImage: 'https://assets-in.bmscdn.com/nmcms/events/banner/desktop/media-desktop-sir-sir-sarla-delhi-theatre-festival-0-2025-11-3-t-17-44-42.jpg',
      category: 'Theatre Shows',
      description: 'Makarand Deshpande’s iconic play&nbsp;Sir Sir Sarla&nbsp;dives deep into the unspoken relationship between a professor and his student — a bond that lingers somewhere between affection, respect, and unfulfilled love. Years later, when they meet again, unresolved emotions resurface, blurring the line between memory and reality.',
      artist: 'DJ Snake',
      artistImage: 'https://lk-aps.bmscdn.com/Artist/2589.jpg',
      duration: '3 hours',
      ageRestriction: '15+',
    },
    {
      id: '15',
      title: 'Sufi Night at Noida',
      venue: 'Kedarnath Sahni Auditorium',
      location: 'Noida',
      date: '2025-11-17T22:00:00',
      price: '₹899',
      image: 'https://media.insider.in/image/upload/c_crop,g_custom/v1753852044/uhx3uuehlydr0hcmgxk3.jpg',
      landscapeImage: 'https://res.cloudinary.com/dwzmsvp7f/image/upload/f_auto,w_1280/c_crop%2Cg_custom%2Fv1753852019%2Fril0oxpkz2s0wc29zc43.jpg',
      category: 'Qawali Night',
      description: 'This Saturday immerse yourself in an evening of soulful melodies and electrifying vibes at Moire. Were thrilled to present the incredibly talented The ILAAHI Band, known for his mesmerizing performances that captivate hearts and uplift spirits.',
      duration: '2 hours',
      ageRestriction: '15+',
    },
    {
      id: '16',
      title: 'Rehmat e Nusrat by Amarrass',
      venue: 'The Piano Man New Delhi',
      location: 'Delhi',
      date: '2025-11-28T20:30:00',
      price: '₹899',
      image: 'https://media.insider.in/image/upload/c_crop,g_custom/v1760787674/vb5m7kz70ltp5jybrcxx.png',
      landscapeImage: 'https://res.cloudinary.com/dwzmsvp7f/image/upload/f_auto,w_1280/c_crop%2Cg_custom%2Fv1760787660%2Fsoigl6oq4est5ouxrtit.jpg',
      category: 'Qawali Night',
      description: 'Rehmat-e-Nusrat is a group of young, self-trained qawwals from the Kumaon hills who consider Ustad Nusrat Fateh Ali Khan their guru and muse. The group presents qawwalis by Ustad Nusrat Fateh Ali Khan, Sufiyana kalaams by legendary poets such as Amir Khusrao, Meera Bai, and Baba Bulleh Shah, as well as ghazals, Kabir bhajans, and original compositions.',
      duration: '2 hours',
      ageRestriction: '15+',
    },
    {
      id: '17',
      title: 'Qawaali Night',
      venue: 'Cosy Box',
      location: 'Gurugram',
      date: '2025-11-28T20:30:00',
      price: '₹899',
      image: 'https://media.insider.in/image/upload/c_crop,g_custom/v1757936057/uh6bl4mpnxluzwht6k0c.png',
      landscapeImage: 'https://res.cloudinary.com/dwzmsvp7f/image/upload/f_auto,w_1280/c_crop%2Cg_custom%2Fv1757936040%2Fev2xnham0sjb9rtti8ay.jpg',
      category: 'Qawali Night',
      description: 'Rehmat-e-Nusrat is a group of young, self-trained qawwals from the Kumaon hills who consider Ustad Nusrat Fateh Ali Khan their guru and muse. The group presents qawwalis by Ustad Nusrat Fateh Ali Khan, Sufiyana kalaams by legendary poets such as Amir Khusrao, Meera Bai, and Baba Bulleh Shah, as well as ghazals, Kabir bhajans, and original compositions.',
      duration: '2 hours',
      ageRestriction: '15+',
    },
    // Add all your existing events here
  ];

  return (
    <div className="mt-24 md:mt-28 lg:mt-32 max-w-7xl mx-auto px-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 items-start">
        {/* Left Column - Main Image */}
        <div className="relative aspect-video rounded-xl overflow-hidden">
          <img 
            src={event.landscapeImage && event.landscapeImage.trim() !== '' ? event.landscapeImage : event.image} 
            alt={event.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>

        {/* Right Column - Event Details */}
        <div className="space-y-6">
          <div>
            <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-sm">
              {event.category}
            </span>
            <h1 className="text-3xl font-bold mt-2">{event.title}</h1>
          </div>

          {/* Artist Image */}
          {event.artistImage && event.artistImage.trim() !== '' && event.artist && (
            <div className="flex items-center gap-4">
              <div className="relative w-24 h-24 rounded-full overflow-hidden ring-2 ring-primary/20">
                <img 
                  src={event.artistImage} 
                  alt={event.artist}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="text-sm text-gray-400">Artist</p>
                <p className="text-lg font-semibold">{event.artist}</p>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div className="flex items-center">
              <Calendar className="w-5 h-5 text-primary mr-3" />
              <div>
                <p className="text-sm text-gray-400">Date & Time</p>
                <p>{new Date(event.showDateTime || event.date).toLocaleString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: '2-digit',
                })}</p>
              </div>
            </div>

            <div className="flex items-center">
              <MapPin className="w-5 h-5 text-primary mr-3" />
              <div>
                <p className="text-sm text-gray-400">Venue</p>
                <p>{event.venue}, {event.location}</p>
              </div>
            </div>

            <div className="flex items-center">
              <Music className="w-5 h-5 text-primary mr-3" />
              <div>
                <p className="text-sm text-gray-400">Duration</p>
                <p>{event.duration}</p>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-white/10">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-sm text-gray-400">Ticket Price</p>
                <p className="text-2xl font-bold text-primary">{event.price}</p>
              </div>
              <button 
                onClick={() => {
                  // Categories that use seat selection layout
                  const seatCategories = ['Comedy Shows', 'Qawali Night', 'Theatre Shows'];
                  
                  if (seatCategories.includes(event.category)) {
                    navigate(`/nightlife/${id}/seats`);
                  } else {
                    navigate(`/nightlife/${id}/tickets`);
                  }
                }}
                className="px-6 py-3 bg-primary hover:bg-primary-dull rounded-lg transition"
              >
                Book Tickets
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* About the Event Section */}
      <section className="mt-16">
        <h2 className="text-2xl font-bold mb-4">About the Event</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <p className="text-gray-300">{event.description}</p>
            <div className="mt-6 space-y-2">
              <p><span className="text-gray-400">Age Restriction:</span> {event.ageRestriction}</p>
              <p><span className="text-gray-400">Artist:</span> {event.artist}</p>
            </div>
          </div>
          <div className="relative aspect-square rounded-xl overflow-hidden">
            <img 
              src={event.artistImage} 
              alt={event.artist}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* You May Also Like Section */}
      <section className="mt-16 mb-16">
        <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {relatedEvents.map(relatedEvent => (
            <div 
              key={relatedEvent._id} 
              className="group rounded-xl overflow-hidden ring-1 ring-white/10 hover:ring-primary transition"
            >
              <div className="relative aspect-[3/4]">
                <img 
                  src={relatedEvent.image} 
                  alt={relatedEvent.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute bottom-0 p-4">
                  <h3 className="text-lg font-bold group-hover:text-primary transition">
                    {relatedEvent.title}
                  </h3>
                  <p className="text-sm text-gray-300">{relatedEvent.venue}</p>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-primary font-bold">{relatedEvent.price}</p>
                    <button 
                      onClick={() => window.location.href = `/nightlife/${relatedEvent._id}`}
                      className="px-3 py-1 bg-primary hover:bg-primary-dull rounded text-sm transition"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default EventDetails;