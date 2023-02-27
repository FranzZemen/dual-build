export class TransformPipe {
    _transform;
    payloadOverride;
    constructor(_transform, passedIn) {
        this._transform = _transform;
        this.payloadOverride = passedIn;
    }
    static transform(transformClass, pipeline, payloadOverride) {
        // ----- Declaration separator ----- //
        return new TransformPipe(new transformClass(pipeline.log.depth + 1), payloadOverride);
    }
    get transformName() {
        if (this._transform) {
            return this._transform.constructor.name;
        }
        else {
            return 'Unreachable code: Containing Object Not Created';
        }
    }
    async execute(passedIn) {
        const actionName = this.transformName;
        try {
            return await this._transform.execute(passedIn, this.payloadOverride);
        }
        catch (err) {
            return Promise.reject(err);
        }
    }
}
