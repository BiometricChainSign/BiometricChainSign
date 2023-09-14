from sys import argv
import json

if __name__ == '__main__':
    print(json.dumps({ 'argv': argv[1] }))
