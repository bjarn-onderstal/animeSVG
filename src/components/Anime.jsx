import { Component, createElement } from "react";
import { useSpring, animated } from "react-spring";

export const AnimatedPath = ({ d, fill, svgFillColor, color, duration, strokeWidth, strokeLength }) => {
    const totalLength = strokeLength || 100;
    const finalStrokeColor = color || fill || svgFillColor;
    const strokeAnimationProps = useSpring({
        from: { strokeDashoffset: totalLength, strokeDasharray: `${totalLength} ${totalLength}` },
        to: async next => {
            // eslint-disable-next-line no-constant-condition
            while (true) {
                await next({ strokeDashoffset: 0, strokeDasharray: `${totalLength} ${totalLength}` });
                await next({ strokeDashoffset: totalLength, strokeDasharray: `${totalLength} 0` });
            }
        },
        config: { duration: duration },
        reset: true
    });

    return (
        <animated.path
            d={d}
            fill="none"
            stroke={finalStrokeColor}
            strokeWidth={strokeWidth}
            style={strokeAnimationProps}
        />
    );
};

export class AnimationFromSVG extends Component {
    extractColorFromSVG(svgString) {
        try {
            const parser = new DOMParser();
            const doc = parser.parseFromString(svgString, "image/svg+xml");
            const svgRoot = doc.querySelector("svg");
            return svgRoot ? svgRoot.getAttribute("fill") || "black" : "black";
        } catch (error) {
            console.error("Error parsing SVG:", error);
            return "black";
        }
    }

    parseSVG(svgString, color, duration, strokeWidth, strokeLength) {
        const svgFillColor = this.extractColorFromSVG(svgString);
        const parser = new DOMParser();
        const doc = parser.parseFromString(svgString, "image/svg+xml");
        const svgRoot = doc.querySelector("svg");
        if (!svgRoot) return { paths: null, width: "100%", height: "100%", viewBox: "0 0 200 200" };

        const viewBox = svgRoot.getAttribute("viewBox") || "0 0 200 200";
        const defaultWidth = svgRoot.getAttribute("width") || "100%";
        const defaultHeight = svgRoot.getAttribute("height") || "100%";
        const paths = svgRoot.querySelectorAll("path");

        const pathLayers = Array.from(paths).map((path, index) => (
            <AnimatedPath
                key={index}
                d={path.getAttribute("d")}
                fill={path.getAttribute("fill") || svgFillColor}
                svgFillColor={svgFillColor}
                color={color}
                duration={duration}
                strokeWidth={strokeWidth}
                strokeLength={strokeLength}
            />
        ));

        return { paths: pathLayers, viewBox, defaultWidth, defaultHeight };
    }

    render() {
        const { svgContent, color, duration, strokeWidth, strokeLength, size } = this.props;
        const svgData = svgContent
            ? this.parseSVG(svgContent, color, duration, strokeWidth, strokeLength)
            : { paths: null, viewBox: "0 0 200 200", defaultWidth: "100%", defaultHeight: "100%" };

        const finalWidth = size === 0 ? svgData.defaultWidth : `${size}px`;
        const finalHeight = size === 0 ? svgData.defaultHeight : `${size}px`;

        return (
            <svg width={finalWidth} height={finalHeight} viewBox={svgData.viewBox} xmlns="http://www.w3.org/2000/svg">
                {svgData.paths}
            </svg>
        );
    }
}
