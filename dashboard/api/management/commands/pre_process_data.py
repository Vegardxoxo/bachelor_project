import pandas as pd

data = pd.read_csv('C:\\Users\\Vegard\\Downloads\\data\\software_per_computer.csv', low_memory=False)


def clean_data(data):
    boolean_columns = [
        'License Required', 'Server', 'Cloud', 'Virtual', 'Portable', 'Terminal Server',
        'Test Development', 'Manual Client', 'Manual Application', 'Gdpr Risk', 'Manufacturer Gdpr Compliant',
        'Manufacturer Ps Sh Compliant', 'Manufacturer Dpd Compliant', 'Suite', 'Part Of Suite', 'License Suite',
        'Part Of License Suite', 'Block Listed'
    ]

    # Convert boolean columns to integer (1 for True, 0 for False)
    for col in boolean_columns:
        data[col] = data[col].fillna(value=0).astype(bool).astype(int)

    # Filter the DataFrame to keep only the rows where 'License Required' is 1 (True)
    data = data[data['License Required'] == 1]
    data['Primary User Email'] = data['Primary User Email'].fillna('ukjent_bruker@email.com')

    # Save the filtered data to a local CSV file
    data.to_csv('filtered_cleaned_data.csv', index=False)

    print('Data cleaned and saved to filtered_cleaned_data.csv')


clean_data(data)
