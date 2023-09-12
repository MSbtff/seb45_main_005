import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { closeModal, openDetailModal, openSongLists } from '../../redux/slice/ModalSlice';
import { setSelectedPlaylistId, playlistInfo } from '../../redux/slice/PlaylistsSlice';
import { RootState } from '../../redux/store';
import xbtn from '../../assets/images/xbtn.svg';
import Album from '../../assets/images/Album.png';
import PlaylistsShowAll from '../Playlist/PlaylistsShowAll';
import PlaylistsDetail from '../Playlist/PlayListsDetail';

export type PlaylistInfo = {
  title: string;
  playlistId: number;
};

const PlaylistModal = () => {
  const headers = {
    'Access-Control-Allow-Origin': 'http://musicforecast.s3-website.ap-northeast-2.amazonaws.com/',
  };
  const dispatch = useDispatch();
  const [title, setTitle] = useState<string>('');
  const isDetailOpen = useSelector((state: RootState) => state.modal.isSongOpen);
  const isShowAll = useSelector((state: RootState) => state.modal.isDetailOpen);
  const playlistsInfo: PlaylistInfo[] = useSelector((state: RootState) => state.playlists.value);

  const handleOpenDetail = () => {
    dispatch(openDetailModal());
  };

  const handleCloseModal = () => {
    dispatch(closeModal());
  };

  const handleOpenListDetail = (playlistId: number) => {
    dispatch(openSongLists());
    dispatch(setSelectedPlaylistId(playlistId));
  };

  useEffect(() => {
    axios
      .get('http://ec2-15-164-171-149.ap-northeast-2.compute.amazonaws.com:8080/playlist', {
        headers,
      })
      .then((res) => {
        dispatch(playlistInfo(res.data.data));
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <>
      <div className="w-[600px] h-[670px] fixed bottom-0 flex justify-center bg-opacity-1 ">
        <div className="w-[600px] h-[670px] mt-12 animate-fadeInBottomRight-fast fixed right-8 top-40">
          <div className="h-[670px] flex flex-col justify-center items-center rounded-2xl bg-gradient-to-b from-[#000000f3] to-[#1d2435] shadow-xl text-[#b3b4ca] animate-scale-anim  ">
            {/* 플레이리스트 상단 */}
            <div className="flex justify-around">
              <button onClick={handleCloseModal} className="mr-10 mt-8 ">
                <img src={xbtn} className="w-[35px]" />
              </button>
              {/* 검색칸 */}
              <div className="flex mt-8">
                <input
                  type="text"
                  placeholder="   플레이리스트 이름을 입력해주세요"
                  className="w-[400px] h-[50px] bg-[#444444d0] rounded-3xl border border-gray-500"
                ></input>
              </div>
              <button className="mt-8"></button>
            </div>
            {/* 플레이리스트 */}
            <div className="w-full h-[50px] flex justify-between items-center mt-8 font-['Anton-Regular']">
              <h1 className="ml-8">Recommend</h1>
              <button onClick={handleOpenDetail} className="mr-12">
                더보기
              </button>
            </div>
            {/* 플리 앨범, 제목, 내용 */}
            <ul className="w-[550px] mt-6 flex">
              <li className="w-[100px] h-[150px] flex justify-start items-center text-center hover:translate-y-[-15px] transition duration-300 ease-in-out">
                <div className="cursor-pointer">
                  <img src={Album} className="h-[100px] w-[100px]" />
                  <h1 className="mt-4">플리 제목</h1>
                </div>
              </li>
            </ul>
            {/* 마이 플레이리스트 */}
            <div className="w-full h-[50px] flex justify-between items-center mt-12 font-['Anton-Regular']">
              <h1 className="ml-8">My Playlists</h1>
              <button onClick={handleOpenDetail} className="mr-12">
                더보기
              </button>
            </div>
            {/* 플리 앨범, 제목, 내용 */}
            <ul className="w-[550px] mt-2 flex justify-center">
              {playlistsInfo.map((el, index) => {
                if (index <= 4) {
                  return (
                    <li
                      onClick={() => handleOpenListDetail(el.playlistId)}
                      className="h-[150px] w-[150px] flex justify-start items-center text-center hover:translate-y-[-15px] transition duration-300 ease-in-out"
                    >
                      <div className=" cursor-pointer w-[100px] h-[100px]">
                        <img src={Album} className=" cursor-pointer w-[100px] h-[100px]" />
                        <h1 className="mt-4 text-xs">{el.title}</h1>
                      </div>
                    </li>
                  );
                }
                return <></>;
              })}
            </ul>
            <div className="w-[150px] h-[30px] mb-4 mt-8"></div>
          </div>
        </div>
      </div>
      {isDetailOpen && <PlaylistsDetail title={title} setTitle={setTitle} />}
      {isShowAll && <PlaylistsShowAll />}
    </>
  );
};

export default PlaylistModal;
