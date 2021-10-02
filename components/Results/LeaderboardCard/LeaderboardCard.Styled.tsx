import styled from 'styled-components'

const StyledLeaderboardCard = styled.div`
  background-color: var(--background2);
  border-radius: 4px;
  display: grid;
  gap: 25px;
  margin: -20px 50px 40px 50px;
  max-width: 1500px;
  width: 100%;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.2);
  z-index: 1;

  .topSection {
    padding: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .leaderboardSection {
    display: grid;
    grid-template-columns: 1.5fr repeat(6, 1fr);
  }

  .titleSection {
    font-size: 14px;
    color: var(--color2);
    padding-bottom: 8px;

    :first-child {
      padding-left: 20px;
    }
  }

  .userSection {
    display: flex;
    align-items: center;
    gap: 15px;
    padding: 1rem;
    user-select: none;
    cursor: pointer;
  }

  .userPlace {
    max-width: 25px;
    width: 100%;
  }

  .userInfo {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .rowDivider {
    background: var(--background3);
    border: none;
    grid-column-end: -1;
    grid-column-start: 1;
    height: 1px;
    margin: 0;
  }

  .divider {
    background: var(--background3);
    width: 1px;
    height: 17px;
  }

  .dividerLarge {
    background: var(--background3);
    width: 1px;
    height: 40px;
  }

  .pointsWrapper {
    font-weight: 400;
    margin-top: auto;
  }

  .distanceTimeWrapper {
    display: flex;
    align-items: center;
    gap: 5px;
    color: var(--color3);
    font-size: 14px;
    font-weight: 400;
    margin-top: 5px;
    margin-bottom: auto;
  }

  .gameInfoWrapper {
    display: flex;
    align-items: center;
    gap: 25px;
  }

  .gameInfoItem {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .gameInfoContent {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  .label1 {
    font-size: 14px; 
  }

  .label2 {
    font-size: 12px; 
    color: var(--color2);
  }

  .settingsAvatar {
    background-color: var(--background1);
    border-radius: 50%;
    height: 50px;
    width: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .userResultSection {
    display: flex;
    flex-direction: column;
    
    user-select: none;
    cursor: pointer;
  }
`

export default StyledLeaderboardCard