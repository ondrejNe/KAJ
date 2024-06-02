
export const cssElementWidth = (element) => {
    return parseInt(window.getComputedStyle(element).width);
}

export const cssElementFreeWidth = (element) => {
    const style = window.getComputedStyle(element);
    const paddingLeft = parseInt(style.paddingLeft);
    const paddingRight = parseInt(style.paddingRight);
    const borderLeft = parseInt(style.borderLeftWidth);
    const borderRight = parseInt(style.borderRightWidth);
    const totalPadding = paddingLeft + paddingRight;
    const totalBorder = borderLeft + borderRight;
    
    return parseInt(style.width) - totalPadding - totalBorder;
}

export const cssElementHeight = (element) => {
    return parseInt(window.getComputedStyle(element).height);
}

export const cssElementFreeHeight = (element) => {
    const style = window.getComputedStyle(element);
    const paddingTop = parseInt(style.paddingTop);
    const paddingBottom = parseInt(style.paddingBottom);
    const borderTop = parseInt(style.borderTopWidth);
    const borderBottom = parseInt(style.borderBottomWidth);
    const totalPadding = paddingTop + paddingBottom;
    const totalBorder = borderTop + borderBottom;

    return parseInt(style.height) - totalPadding - totalBorder;
}

export const cssElementPadding = (element) => {
    const style = window.getComputedStyle(element);
    const paddingTop = parseInt(style.paddingTop);
    const paddingRight = parseInt(style.paddingRight);
    const paddingBottom = parseInt(style.paddingBottom);
    const paddingLeft = parseInt(style.paddingLeft);

    return {
        top: paddingTop,
        right: paddingRight,
        bottom: paddingBottom,
        left: paddingLeft
    };
}
