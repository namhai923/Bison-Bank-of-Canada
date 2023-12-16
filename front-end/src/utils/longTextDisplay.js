const longTextDisplay = (text, maxLen) => {
    return text.length > maxLen ? `${text.slice(0, maxLen - 1)}...` : text;
};

export default longTextDisplay;
