import { Pencil1Icon, TrashIcon } from '@radix-ui/react-icons'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Database } from '@/types/supabase'

type Todo = Database['public']['Tables']['todos']['Row']

type TodosListProps = {
  todos: Todo[]
  onDelete: (id: Todo['id']) => void
  onSelectTodo: (todo: Todo) => void
}

const TodosList: React.FC<TodosListProps> = ({
  todos,
  onDelete,
  onSelectTodo,
}) => {
  return (
    <div className="space-y-8">
      {todos?.map((todo) => (
        <Card.Root key={todo.id} className="w-full">
          <Card.Header>
            <Card.Title>{todo.title || 'No title provided'}</Card.Title>
          </Card.Header>
          <Card.Content>
            <Card.Description>
              {todo.content || 'No content provided'}
            </Card.Description>
          </Card.Content>
          <Card.Footer className="gap-2">
            <Button
              variant="secondary"
              size="icon"
              className="ml-auto"
              onClick={() => onSelectTodo(todo)}
            >
              <Pencil1Icon />
              <span className="sr-only">Edit</span>
            </Button>
            <Button
              variant="destructive"
              size="icon"
              onClick={() => onDelete(todo.id)}
            >
              <TrashIcon />
              <span className="sr-only">Delete</span>
            </Button>
          </Card.Footer>
        </Card.Root>
      ))}
    </div>
  )
}

export { TodosList }
export type { TodosListProps }
