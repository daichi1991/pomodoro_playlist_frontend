import { Pomodoro } from '../../types';
import { Player } from '../Player/Index';

interface Props {
  pomodoro: Pomodoro;
}

export const PomodoroPlayer: React.FC<Props> = (props: Props) => {
  return (
    <>
      <h1>Play Pomodoro</h1>
      {props.pomodoro.name}
      <Player />
    </>
  );
};
