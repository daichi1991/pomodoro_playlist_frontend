interface Props {
  title: string;
}

export const PageTitle: React.FC<Props> = (props: Props) => {
  return (
    <div className="text-xl mb-4">{props.title}</div>
  );
}