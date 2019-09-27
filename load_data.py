import csv
import api.models

with open("/home/alexweiss/Downloads/Kiosk Data 19-20 - Sheet1.csv") as csv_file:
	reader = csv.reader(csv_file)
	i = 0
	for row in reader:
		if i > 0:
			name = " ".join(row[0].split(", ")[::-1])
			student_id = row[1]
			grade = row[2]
			privilege_granted = True if int(grade)==12 else False
			pathToImage = ""
			api.models.Student.objects.create(name=name, grade=grade, student_id=student_id,privilege_granted=privilege_granted,pathToImage="")
		i += 1

		
