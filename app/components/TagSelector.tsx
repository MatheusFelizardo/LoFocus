import { Autocomplete, TextField, Chip } from "@mui/material";
import { useEffect } from "react";
import { Tag, useTagStore } from "../stores/useTagsStore";

export function TagSelector({
  value,
  onChange,
}: {
  value: Tag[];
  onChange: (tags: Tag[]) => void;
}) {
  const { tags, fetchTags, addTag } = useTagStore();

  useEffect(() => {
    fetchTags();
  }, [fetchTags]);

  return (
    <Autocomplete<Tag, true, false, true>
      multiple
      freeSolo
      options={tags.map((tag) => ({ id: tag.id, name: tag.name }))}
      getOptionLabel={(option) =>
        typeof option === "string" ? option : option.name
      }
      value={value}
      onChange={async (_, newValue) => {
        const finalTags: Tag[] = [];

        for (const option of newValue) {
          if (typeof option === "string") {
            const newTag = await addTag(option);
            if (newTag) {
              finalTags.push(newTag as Tag);
            }
          } else {
            finalTags.push(option);
          }
        }

        onChange(finalTags);
      }}
      isOptionEqualToValue={(o, v) => o.id === v.id}
      renderValue={(selected, getTagProps) =>
        selected.map((option, index) => (
          <Chip
            label={typeof option === "string" ? option : option.name}
            {...getTagProps({ index })}
            key={option.toString() + index}
          />
        ))
      }
      renderInput={(params) => <TextField {...params} label="Tags" />}
    />
  );
}
