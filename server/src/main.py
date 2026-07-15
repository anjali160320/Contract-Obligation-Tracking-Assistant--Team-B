from fastapi import FastAPI

# Initialize the FastAPI application instance
app = FastAPI(title="ContractIQ API", description="Backend services for ContractIQ")

@app.get("/")
def root():
    """
    Health check endpoint to verify the backend is running.
    """
    return {"message": "Backend is running!"}