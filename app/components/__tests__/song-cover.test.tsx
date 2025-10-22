import { render } from '@testing-library/react';
import SongCover from '../song-cover';
import { Song } from '@/app/utils/music-context';

describe('SongCover', () => {
  it('renders with artworkURL', () => {
    const song: Song = {
      id: '1',
      title: 'Test Song',
      filename: 'test.mp3',
      artist: 'Test Artist',
      album: 'Test Album',
      path: '/music/test.mp3',
      metadata: {},
      artworkURL: 'https://example.com/art.jpg',
    };
    render(<SongCover song={song} />);
  });

  it('renders with fallback image', () => {
    const song: Song = {
      id: '2',
      title: 'No Art Song',
      filename: 'test2.mp3',
      artist: 'Test Artist',
      album: 'Test Album',
      path: '/music/test2.mp3',
      metadata: {},
    };
    render(<SongCover song={song} />);
  });
});
