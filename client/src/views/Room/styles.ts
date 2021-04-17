import styled from 'styled-components'

export const MainWrapper = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  div.users-in-room-map {
    width: 400px;
    height: 400px;
    background: lightblue;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    p.single-room-user {
      margin: 20px 0;
    }
  }
`
