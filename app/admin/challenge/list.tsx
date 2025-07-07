import {
  Datagrid,
  List,
  NumberField,
  ReferenceField,
  SelectField,
  TextField,
} from "react-admin";

export const ChallengeList = () => {
  return (
    <List>
      <Datagrid rowClick="edit">
        <NumberField source="id" />
        <TextField source="question" />
        <SelectField
          source="type"
          choices={[
            {
              id: "SELECT",
              name: "SELECT",
            },
            {
              id: "ASSIST",
              name: "ASSIST",
            },
            {
              id: "FILL_BLANK",
              name: "FILL_BLANK",
            },
            {
              id: "MATCHING",
              name: "MATCHING",
            },
            {
              id: "ARRANGE",
              name: "ARRANGE",
            },
            {
              id: "VOCAB_INTRO",
              name: "VOCAB_INTRO",
            },
          ]}
        />
        <ReferenceField source="lessonId" reference="lessons" />
        <NumberField source="order" />
      </Datagrid>
    </List>
  );
};
