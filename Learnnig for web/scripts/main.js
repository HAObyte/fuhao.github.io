const myHeading = document.querySelector("h1");
const textContainer = document.querySelector(".text-container"); // 需要添加一个容器
let currentStringIndex = 0;
let currentLength = 0;
const typingDelay = 50;    // 打字速度
const erasingDelay = 30;   // 擦除速度
const pauseDelay = 1500;   // 显示停留时间
const strings = [
    "Excellence in Academics, Innovation in Mind",
    "Knowledge Knows No Boundaries",
    "Think Beyond, Create the Future",
    "Science Shapes World, Wisdom Lights Way"
];

// 预先计算最大高度并固定容器
function setMaxHeight() {
    const temp = document.createElement('div');
    temp.style.visibility = 'hidden';
    temp.style.position = 'absolute';
    temp.style.whiteSpace = 'nowrap';
    temp.style.font = getComputedStyle(myHeading).font;

    // 找到最长的字符串
    let longestString = '';
    strings.forEach(str => {
        if (str.length > longestString.length) longestString = str;
    });

    temp.textContent = longestString;
    document.body.appendChild(temp);
    const height = temp.getBoundingClientRect().height;
    document.body.removeChild(temp);

    // 设置容器高度，修正字符串插值语法
    textContainer.style.minHeight = `${height + 50}px`;
}

// 状态常量
const TYPING = 0;
const PAUSING = 1;
const ERASING = 2;
let currentState = TYPING;

function animateText() {
    const currentString = strings[currentStringIndex];

    if (currentState === TYPING) {
        // 打字阶段
        myHeading.textContent = currentString.substring(0, currentLength);
        currentLength++;

        if (currentLength > currentString.length) {
            currentState = PAUSING;
            setTimeout(animateText, pauseDelay);
        } else {
            setTimeout(animateText, typingDelay);
        }
    } else if (currentState === ERASING) {
        // 擦除阶段
        currentLength--;
        myHeading.textContent = currentString.substring(0, currentLength);

        if (currentLength <= 0) {
            currentState = TYPING;
            currentStringIndex = (currentStringIndex + 1) % strings.length;
            setTimeout(animateText, typingDelay);
        } else {
            setTimeout(animateText, erasingDelay);
        }
    } else {
        // 暂停阶段
        currentState = ERASING;
        setTimeout(animateText, erasingDelay);
    }
}

// 使用 Intersection Observer 确保字体加载完成后再计算高度
const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
        setMaxHeight();
        animateText();
        observer.disconnect();
    }
});
observer.observe(myHeading);