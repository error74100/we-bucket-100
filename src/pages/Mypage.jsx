function Mypage({ user }) {
  console.log(user);

  return (
    <>
      {user && (
        <>
          <div>Mypage</div>
          <div>이미지 : ()</div>
          <div>이름 : {user.displayName}</div>
          <div>mail : {user.email}</div>
        </>
      )}
    </>
  );
}

export default Mypage;
