import { Header } from './components/Header/Index';
import { Player } from './components/Player/Index';
import { Playlist } from './components/Playlist/Index';
import { Tracks } from './components/Tracks/Index';

export default function Home() {
  return (
    <div>
      <Header />
      <Playlist />
      <Tracks />
      <Player />
    </div>
  );
}
