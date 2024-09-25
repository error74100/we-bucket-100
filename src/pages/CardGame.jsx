import { useEffect, useRef, useState } from 'react';

const BORAD_SIZE = 16; // 게임판 사이즈

function CardGame() {
  const [init, setInit] = useState(false);
  const [ready, setReady] = useState(false);
  const [card, setCard] = useState([]);
  const [reset, setReset] = useState(false);
  const [isCheck, setIsCheck] = useState(false);
  const [choiceCardOne, setChoiceCardOne] = useState(null);
  const [choiceCardTwo, setChoiceCardTwo] = useState(null);
  const totalCardRef = useRef(BORAD_SIZE);

  useEffect(() => {
    generateNumbers();
    initCard();
  }, [init, reset]);

  const generateNumbers = () => {
    // 0부터 30까지 중복되지 않는 5개의 숫자
    const uniqueNumbers = getRandomUniqueNumbers(0, 30, BORAD_SIZE / 2);

    setCard(uniqueNumbers);
    setInit(true);
    // setReady(true);
  };

  function getRandomUniqueNumbers(min, max, count) {
    const numbers = [];

    while (numbers.length < count) {
      const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;

      // 중복 방지
      if (!numbers.some((item) => item.number === randomNumber)) {
        numbers.push({
          number: randomNumber,
          imgURL: `/image/card_img_${randomNumber}.jpg`,
          complete: false,
        });
      }
    }

    // 카드는 두 장씩 필요하므로 한 번 더 추가
    numbers.push(...numbers);

    shuffle(numbers);

    return numbers;
  }

  // 카드 섞기
  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  // 카드 오픈(뒷면에서 앞면으로)
  function openCard(item, index) {
    const cardBack = document.querySelector('.card_wrap .inner');
    const cardFront = document.querySelector('.card_wrap .inner');

    if (isCheck || item.complete || !ready) {
      return;
    }

    if (choiceCardOne === null) {
      setChoiceCardOne({ ...item, idx: index });
    } else {
      if (choiceCardOne.idx === index) {
        return;
      }

      setChoiceCardTwo((prevState) => {
        const updatedUserInfo = {
          number: item.number,
          imgURL: item.imgURL,
          complete: item.complete,
          idx: index,
        };

        setIsCheck(true);

        cardCheck(choiceCardOne, updatedUserInfo);

        return updatedUserInfo;
      });
    }

    cardBack.childNodes[index].querySelector('.card__back').style.transform =
      'rotateY(180deg)';
    cardFront.childNodes[index].querySelector('.card__front').style.transform =
      'rotateY(0deg)';
  }

  // 카드 클로즈(앞면에서 뒷면으로)
  function closeCard(index) {
    const cardBack = document.querySelector('.card_wrap .inner');
    const cardFront = document.querySelector('.card_wrap .inner');

    cardBack.childNodes[index].querySelector('.card__back').style.transform =
      'rotateY(0)';
    cardFront.childNodes[index].querySelector('.card__front').style.transform =
      'rotateY(-180deg)';
  }

  function cardFilpBack(index) {
    setTimeout(() => {
      closeCard(index);
      setIsCheck(false);
    }, 800);
  }

  function cardCheck(one, two) {
    const itemOne = one;
    const itemTwo = two;

    if (itemOne.number === itemTwo.number) {
      setCard((prevItems) =>
        prevItems.map((item) =>
          item.number === itemOne.number
            ? { ...item, complete: !item.complete }
            : item
        )
      );

      setIsCheck(false);
      totalCardRef.current = totalCardRef.current - 2;
    } else {
      cardFilpBack(itemOne.idx);
      cardFilpBack(itemTwo.idx);
    }

    setChoiceCardOne(null);
    setChoiceCardTwo(null);

    if (totalCardRef.current === 0) {
      setTimeout(() => {
        alert('모두 완료 하였습니다.');
        setReset(true);
        resetCard();
      }, 500);
    }
  }

  function resetCard() {
    for (let i = 0; i < BORAD_SIZE; i++) {
      closeCard(i);
    }

    totalCardRef.current = BORAD_SIZE;
  }

  function initCard() {
    if (card.length === 0) {
      return;
    }

    const cardBack = document.querySelector('.card_wrap .inner');
    const cardFront = document.querySelector('.card_wrap .inner');

    setTimeout(() => {
      card.forEach((item, idx) => {
        cardBack.childNodes[idx].querySelector('.card__back').style.transform =
          'rotateY(180deg)';
        cardFront.childNodes[idx].querySelector(
          '.card__front'
        ).style.transform = 'rotateY(0deg)';
      });
    }, 500);

    setTimeout(() => {
      card.forEach((item, idx) => {
        closeCard(idx);
      });
    }, 2000);

    setTimeout(() => {
      setReady(true);
    }, 2800);
  }

  return (
    <>
      <div className="card_wrap">
        <div className="inner">
          {card.map((item, index) => {
            return (
              <div
                key={index}
                className="card"
                onClick={() => {
                  openCard(item, index);
                }}
              >
                <div className="card__back"></div>
                <div
                  className="card__front"
                  style={{
                    backgroundImage: `url(/img/card_img_${item.number}.jpg)`,
                  }}
                ></div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default CardGame;
