import axios from 'axios';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { RootState } from '../../../redux/store';
import { deletedSongs } from '../../../redux/slice/SonglistsSlice';

export type deleteProps = {
  songId: number;
};

const SongDeleteBtn = ({ songId }: deleteProps) => {
  const dispatch = useDispatch();

  const token = useSelector((state: RootState) => state.login.accessToken);
  const playlistId = useSelector((state: RootState) => state.playlists.selectedPlaylistId);
  // 노래 삭제
  const handleSongDelete = () => {
    const shouldDelete = window.confirm('정말 삭제하시겠습니까?');

    if (shouldDelete) {
      return axios
        .patch(
          `http://ec2-15-164-171-149.ap-northeast-2.compute.amazonaws.com:8080/song/${playlistId}/${songId}/delete`,
          {},
          {
            headers: {
              Authorization: token,
            },
          }
        )
        .then((res) => {
          dispatch(deletedSongs(songId));
          console.log('삭제 되었습니다.', res);
        })
        .catch((err) => {
          console.log(err);
        });
    }
    return <></>;
  };

  return (
    <>
      <button
        onClick={handleSongDelete}
        className="w-[150px] h-[50px] mb-4 mr-4 rounded-2xl border-2 border-purple-400 hover:bg-[#9574b1] hover:text-white"
      >
        삭제하기
      </button>
    </>
  );
};

export default SongDeleteBtn;
