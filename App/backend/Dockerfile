FROM python:3.11-slim
WORKDIR /app
COPY app.py ./
COPY requirements.txt ./
RUN python -m pip install --no-cache-dir -r requirements.txt
EXPOSE 8000
CMD ["python", "app.py"]


