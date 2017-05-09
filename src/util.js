function formatTemp(value, system) {
    if (system === 'c') {
        return value + '°C';
    }
    return value;
}

function formatGravity(value) {
    return (value / 1000).toFixed(3);
}


export {formatTemp, formatGravity};
