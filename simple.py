import torch
from diffusers import StableDiffusionPipeline

def main():
    # Load Stable Diffusion (open source)
    model_id = "runwayml/stable-diffusion-v1-5"
    device = "cuda" if torch.cuda.is_available() else "cpu"

    print(f"Loading model on {device}...")
    pipe = StableDiffusionPipeline.from_pretrained(
        model_id,
        torch_dtype=torch.float16 if device == "cuda" else torch.float32
    ).to(device)

    # Prompt for image
    prompt = input("Enter prompt: ")

    # Generate image
    with torch.autocast(device):
        image = pipe(prompt, guidance_scale=7.5).images[0]

    # Save
    filename = prompt.replace(" ", "_")[:50] + ".png"
    image.save(filename)
    print(f"Saved: {filename}")

if __name__ == "__main__":
    main()
