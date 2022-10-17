/**
 * Creates a new Pixel Perfect Handler function.
 * 
 * Access via `InputPlugin.makePixelPerfect` rather than calling it directly.
 * @param textureManager A reference to the Texture Manager.
 * @param alphaTolerance The alpha level that the pixel should be above to be included as a successful interaction.
 */
function CreatePixelPerfectHandler(textureManager: TextureManager, alphaTolerance: number) {
    return (hitArea, x: number, y: number, gameObject) => {
        const alpha = textureManager.getPixelAlpha(x, y, gameObject.texture.key, gameObject.frame.name);
        return (alpha && alpha >= alphaTolerance)
    }
}
export default CreatePixelPerfectHandler;