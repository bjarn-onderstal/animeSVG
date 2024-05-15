import { Component, createElement } from "react";

import { AnimationFromSVG } from "./components/Anime";

export class AnimeSVG extends Component {
    render() {
        return (
            <AnimationFromSVG
                svgContent={this.props.inputSVG.value}
                color={this.props.color}
                toLoop={this.props.loop}
                duration={this.props.duration}
                strokeWidth={this.props.strokeWidth}
                strokeLength={this.props.strokeLength}
                size={this.props.size}
            />
        );
    }
}
