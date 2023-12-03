import os
from flask import Flask, request, jsonify, send_file
from base64 import b64encode
import requests
from flask_cors import CORS

app = Flask(__name__)
CORS(app)



# Código para utilizar la API de GECO (inconcluso)

# URL de la API de GECO
GECO_API_URL = "http://devsysii.iingen.unam.mx/geco4/proyectos/apidocs/"
token = "c51ff1be61b99259fd2f29730c6276f95944287e"

CORPUS_DIR = 'corpus'

"""
# Endpoint para obtener el listado de corpus
@app.route('/getCorpus', methods=['GET'])
def get_corpus():
    try:
        # Contactar a la API de GECO para obtener el listado de corpus
        url = GECO_API_URL + 'corpus/publicos'
        headers = {'Authorization': 'Token ' + token}
        response = requests.get(url, headers=headers)
        corpus_data = response.json()['data']

        return jsonify(corpus_data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Endpoint para obtener concordancias en el texto
@app.route('/getConcordancesText', methods=['GET'])
def get_concordances_text():
    try:
        # Obtener parámetros de la solicitud
        corpus_id = request.args.get('corpus_id')
        match = request.args.get('match')

        # Obtener la lista de archivos del corpus desde la API de GECO
        url = GECO_API_URL + f'corpus/{corpus_id}'
        headers = {'Authorization': 'Token ' + token}
        response = requests.get(url, headers=headers)
        corpus_files = response.json()['data']

        # Buscar concordancias en cada archivo
        concordances = []
        for file in corpus_files:
            file_id = file['id']
            url = GECO_API_URL + f'corpus/{corpus_id}/{file_id}'
            response = requests.get(url, headers=headers)
            file_content = response.json()['data']

            # Realizar la búsqueda en el contenido del archivo
            matches = find_concordances(file_content, match)
            print(file)

            # Agregar las concordancias al resultado
            for match_pos in matches:
                concordance = get_window_around_match(file_content, match_pos)
                concordances.append(concordance)

        return jsonify(concordances)
    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 500

def find_concordances(text, match):
    # Implementar la lógica de búsqueda de concordancias en el texto
    # Devolver las posiciones de las concordancias encontradas
    return []

def get_window_around_match(text, match_pos):
    # Implementar la lógica para obtener una ventana de palabras alrededor de la concordancia
    # Devolver la concordancia con el contexto
    return []
"""








# Código para una API simulada (con datos mock)

# Retorna un JSON con una lista de los corpus existentes, con estructura {id, nombre}.
@app.route("/getCorpus", methods=["GET"])
def get_corpus_list():
    corpus_data = [
        {"id": 1, "nombre": "Prueba"}
    ]
    return jsonify(corpus_data)

# Retorna un JSON con una lista de los archivos principales correspondientes al corpus indicado en
# el parametro corpus_id, con estructura {id, nombre, type}. El valor de type puede ser audio, xml o img, e
# indica la forma de interpretación del archivo. A diferencia de la funcionalidad actual de GECO, donde se
# admiten únicamente archivos TXT como parte del corpus, aquí se permite retornar un archivo XML como parte
# del corpus. De esta forma, el front-end interpreta de distinta forma los archivos XML, dependiendo del valor
# de type.
@app.route("/getCorpusFiles", methods=["GET"])
def get_corpus_files():
    corpus_id = request.args.get('corpus_id')
    # Search corpus and get associated files
    corpus_files = []
    if corpus_id == '1':
        corpus_files = [
        # NOTA: Se asume que se agrega un metadado type al archivo para saber como interpretar el archivo XML.
            {"id": 1, "nombre": "Fundam-Nat.xml", "type": "audio"},
            {"id": 2, "nombre": "prueba-xml.xml", "type": "xml"},
            {"id": 3, "nombre": "historieta.xml", "type": "img"},
            {"id": 4, "nombre": "definir_comme.xml", "type": "xml"},
        ]
    return jsonify(corpus_files)

# Retorna el archivo con file_id, asociado a corpus_id, incluyendo sus archivos adjuntos.
# La estructura de la respuesta es
# {file: "contenido del archivo codificado en Base64", name, type, attachments: [ {name, file}, ... ]}
@app.route("/getFileWithAttachments", methods=["GET"])
def get_file_with_attachments():
    try:
        corpus_id = request.args.get('corpus_id')
        file_id = request.args.get('file_id')

        # Obtener el tipo de archivo y la ruta al archivo principal
        file_type, file_path = get_file_info(corpus_id, file_id)

        # Leer el contenido del archivo principal
        with open(file_path, 'r') as file:
            content = file.read()

        # Obtener los archivos adjuntos
        attachments = get_attachments(corpus_id, file_id)

        # Devolver la respuesta en formato JSON
        return jsonify({"file": content, "name": os.path.basename(file_path), "type": file_type, "attachments": attachments})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def get_file_info(corpus_id, file_id):
    # Lógica para obtener el tipo de archivo y la ruta al archivo principal
    # Puedes adaptar esto según la estructura de tu sistema de archivos
    if file_id == '1':
        return "audio", os.path.join(CORPUS_DIR, f'{corpus_id}', "Fundam-Nat.xml")
    elif file_id == '2':
        return "xml", os.path.join(CORPUS_DIR, f'{corpus_id}', "prueba-xml.xml")
    elif file_id == '3':
        return "img", os.path.join(CORPUS_DIR, f'{corpus_id}', "historieta.xml")
    else:
        return "xml", os.path.join(CORPUS_DIR, f'{corpus_id}', "definir_comme.xml")

def get_attachments(corpus_id, file_id):
    # Lógica para obtener archivos adjuntos
    # Puedes adaptar esto según la estructura de tu sistema de archivos
    attachments_dir = os.path.join(CORPUS_DIR, f'{corpus_id}', 'adjuntos', f'{file_id}')
    attachments = []

    for attachment_file in os.listdir(attachments_dir):
        attachment_path = os.path.join(attachments_dir, attachment_file)
        with open(attachment_path, 'rb') as attachment:
            # Serializar archivo adjunto en Base64
            attachment_content = b64encode(attachment.read()).decode('utf-8')
            attachments.append({"name": attachment_file, "file": attachment_content})

    return attachments

if __name__ == "__main__":
    app.run(debug=True)
