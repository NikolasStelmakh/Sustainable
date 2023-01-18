import { useState } from 'react';
import Header, { User } from './components/Header';
import UserTasksList from './components/UserTasksList';

export default function Home() {
  const [activeUser, setActiveUser] = useState<User | null>(null);

  return (
    <div>
      <Header activeUser={activeUser} setActiveUser={setActiveUser} />
      {activeUser?.id ? <UserTasksList userId={activeUser?.id} /> : null}
    </div>
  );
}
