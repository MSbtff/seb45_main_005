import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { RootState } from '../redux/store';
import { selectedSonglist } from '../redux/slice/SonglistsSlice';
import Header from '../components/Header';
import PlaylistIcon from '../components/Playlist/PlaylistIcon';

import plicon from '../assets/images/plicon.png';

interface Post {
  postId: number;
  title: string;
  voteCount: number;
  viewCount: number;
  text: string;
  nickName: string;
  memberId: number;
  comments: [];
}

const CommunityEdit = () => {
  const [posts, setPosts] = useState<Post>({
    postId: 0,
    title: '',
    viewCount: 0,
    voteCount: 0,
    text: '',
    nickName: '',
    memberId: 0,
    comments: [],
  });
  const [title, setTitle] = useState(posts.title);
  const [content, setContent] = useState(posts.text);
  const [SongData, setSongData] = useState([]);
  // const [song, setSong] = useState('');
  const navigate = useNavigate();
  const accessToken = useSelector((state: RootState) => state.login.accessToken);
  const memberId = useSelector((state: RootState) => state.login.memberid);
  // const refreshToken = useSelector((state: RootState) => state.login.refreshToken);
  // const dispatch = useDispatch();

  console.log(memberId);
  const { id } = useParams();

  // id 변수를 숫자로 파싱
  const numericId = parseInt(id, 10);

  const headers = {
    'Access-Control-Allow-Origin': `${process.env.REACT_APP_FE_HEADER_URL}`,
  };
  const [keyword, setKeyword] = useState('');
  const dispatch = useDispatch();

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BE_API_URL}/posts/${numericId}`, {
        headers,
      })
      .then((res) => {
        setPosts(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [numericId]);

  useEffect(() => {
    setTitle(posts.title);
    setContent(posts.text);
  }, [posts]);

  const handleSearch = () => {
    axios
      .get(`${process.env.REACT_APP_BE_API_URL}/song/search?keyword=${keyword}&song=10`, {
        headers,
      })
      .then((res) => {
        setSongData(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSearch();
    }
  };

  const [selectedItems, setSelectedItems] = useState([]); // 선택된 항목을 저장할 상태

  // const SongData = useSelector((state: RootState) => state.songlists.value);

  const handleSongClick = (el: object) => {
    const isSelected = selectedItems.includes(el);
    if (isSelected) {
      setSelectedItems(selectedItems.filter((item) => item !== el));
    } else {
      setSelectedItems([...selectedItems, el]);
      dispatch(selectedSonglist(el));
    }
  };

  const handleCancel = () => {
    navigate('../community');
  };

  const handlePost = async () => {
    // 등록 버튼 클릭 시 POST 요청을 보내는 함수
    try {
      const response = await axios.patch(
        `${process.env.REACT_APP_BE_API_URL}/posts/${numericId}`,
        {
          title,
          text: content,
        },
        {
          headers: {
            'Authorization': accessToken,
            'Access-Control-Allow-Origin': `${process.env.REACT_APP_FE_HEADER_URL}`,
          },
        }
      );

      console.log('서버 응답:', response.data);
      console.log('postId', response.data.data.postId);
      console.log('이름', response.data.data.nickName);

      // POST 요청 성공 후 필요한 작업 수행
      // 예를 들어, 페이지 이동 또는 메시지 표시 등
      navigate(`../community/${response.data.data.postId}`);
    } catch (error) {
      console.error('POST 요청 실패:', error);
      // POST 요청 실패 시 처리할 내용 추가
      alert(error);
    }
  };
  return (
    <>
      <div className="bg-gradient-to-b from-[#ffffff] to-[#d1d1d1]">
        <Header />
        <div className="flex justify-center mt-10">
          <div className="w-[745px]">
            <button className="mr-2 underline" onClick={handlePost}>
              등록
            </button>
            <button className="underline" onClick={handleCancel}>
              취소
            </button>
          </div>
          <div className="w-[255px]">←</div>
        </div>
        <form>
          <div className="w-full h-[1024px] flex justify-center mt-2">
            <div className="flex flex-col w-[500px] items-center">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-[500px] h-[60px] bg-white shadow-lg rounded-md text-gray-700 pl-5"
                placeholder="제목을 입력하세요."
              />

              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-[500px] h-[400px] bg-white shadow-lg rounded-md mt-1 text-gray-700 resize-none py-5 px-5"
                placeholder="내용을 입력하세요."
              />
            </div>
            <div className="flex flex-col w-[300px] items-center">
              <img src={plicon} alt="플레이리스트아이콘" className="mt-2" />
            </div>

            <div className="flex flex-col w-[300px] h-[462px] items-center shadow-lg rounded-md bg-white">
              <div className="mt-2 w-[250px] h-[50px] bg-white shadow-lg rounded-xl text-gray-700 border-2 border-solid-black text-center flex justify-between items-center">
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className=""
                  placeholder="노래제목 검색"
                  onKeyPress={handleKeyPress}
                />
                <button onClick={handleSearch}>검색</button>
              </div>
              <ul className="w-[290px] h-[350px] overflow-y-scroll scroll-none">
                {SongData.map((el, index) => (
                  <li
                    className="flex justify-between items-center"
                    key={index}
                    onClick={() => handleSongClick(el)} // li 요소 클릭 시 토글 함수 호출
                  >
                    <input
                      type="checkbox"
                      className="w-[10px]"
                      onClick={() => handleSongClick(el)}
                      checked={selectedItems.includes(el)}
                    />
                    <h3 className="text-xs w-[10px]">{index + 1}</h3>

                    <div className="h-[50px] w-[50px] flex items-center ">
                      <img src={el.imageUrl} className="w-[30px] h-[30px] " />
                    </div>
                    <div className="w-[220px]">
                      <p className="text-xs">{el.artistName}</p>
                      <h3 className="text-xs">{el.title}</h3>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </form>
        <PlaylistIcon />
      </div>
    </>
  );
};

export default CommunityEdit;
